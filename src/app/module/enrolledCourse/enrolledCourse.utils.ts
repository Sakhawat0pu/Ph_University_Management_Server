export const calculateGradeAndGradePoint = (totalNumber: number) => {
  const result = {
    grade: 'NA',
    gradePoint: 0,
  };

  if (totalNumber < 60) {
    result.grade = 'F';
    result.gradePoint = 0.0;
  } else if (totalNumber >= 60 && totalNumber <= 69) {
    result.grade = 'D';
    result.gradePoint = 1.0;
  } else if (totalNumber >= 70 && totalNumber <= 79) {
    result.grade = 'C';
    result.gradePoint = 2.0;
  } else if (totalNumber >= 80 && totalNumber <= 89) {
    result.grade = 'B';
    result.gradePoint = 3.0;
  } else {
    result.grade = 'A';
    result.gradePoint = 4.0;
  }

  console.log(result);
  return result;
};
