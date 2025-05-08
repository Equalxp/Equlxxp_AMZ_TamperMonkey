
const timeRangeWeekStart = "2023-10-28"
// 获取从指定开始日期到当前日期之间的所有周六日期
function getSaturdaysUntilNow(startDate) {
    const saturdays = [];
    let currentDate = new Date(startDate);
    const now = new Date();

    // 确保开始日期是周六
    while (currentDate.getDay() !== 6) {
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // 遍历从开始日期到当前日期之间的所有周六
    while (currentDate <= now) {
        saturdays.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return saturdays;
}

const timeRangeWeek = getSaturdaysUntilNow(timeRangeWeekStart);
console.log(timeRangeWeek)
console.log(timeRangeWeek.length)