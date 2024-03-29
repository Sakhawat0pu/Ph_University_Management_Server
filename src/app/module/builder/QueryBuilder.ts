import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchFields: string[]) {
    const searchTerm = this?.query?.searchTerm || '';
    this.modelQuery = this.modelQuery.find({
      $or: searchFields.map(
        (field) =>
          ({
            [field]: { $regex: searchTerm, $options: 'i' },
          }) as FilterQuery<T>,
      ),
    });
    return this;
  }

  filter() {
    const queryObject = { ...this?.query };
    const fieldsToBeDeleted = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    fieldsToBeDeleted.forEach((field) => delete queryObject[field]);

    this.modelQuery = this.modelQuery.find(queryObject as FilterQuery<T>);
    return this;
  }

  sort() {
    const sort = (this?.query?.sort as string)?.split(',').join(' ') || 'id'; // here '-' in front for createdAt means descending order
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  selectFields() {
    const fields =
      (this?.query?.fields as string)?.split(',').join(' ') || '-__v';
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  async countTotal() {
    const queries = this.modelQuery.getFilter(); // returns all the queries
    const totalDocuments = await this.modelQuery.model.countDocuments(queries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);
    return {
      page,
      limit,
      totalPage,
      totalDocuments,
    };
  }
}

export default QueryBuilder;
