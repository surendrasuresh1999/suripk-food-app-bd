const moment = require("moment");

const sendOrdersFullData = (orders) => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const lastMonthStartDate = new Date(currentYear, currentMonth - 1, 1); // First day of last month
  const lastMonthEndDate = new Date(currentYear, currentMonth, 0); // Last day of last month

  // Function to check if createdAt falls within the specified range
  const isWithinMonthRange = (createdAt, startDate, endDate) => {
    const orderDate = new Date(createdAt);
    return orderDate >= startDate && orderDate <= endDate;
  };

  // Filter orders for last month and current month
  const lastMonthOrders = orders.filter((order) =>
    isWithinMonthRange(order.createdAt, lastMonthStartDate, lastMonthEndDate)
  );
  const currentMonthOrders = orders.filter((order) =>
    isWithinMonthRange(
      order.createdAt,
      new Date(currentYear, currentMonth, 1),
      today
    )
  );

  // Calculate total order amounts for last month and current month
  const totalAmountLastMonth = lastMonthOrders.reduce(
    (total, order) => total + order.totalAmount,
    0
  );
  const totalAmountCurrentMonth = currentMonthOrders.reduce(
    (total, order) => total + order.totalAmount,
    0
  );

  // Calculate percentage change
  let percentageChange;
  if (totalAmountLastMonth !== 0) {
    percentageChange =
      ((totalAmountCurrentMonth - totalAmountLastMonth) /
        totalAmountLastMonth) *
      100;
  } else {
    percentageChange = totalAmountCurrentMonth !== 0 ? 100 : 0;
  }

  return {
    total: orders.length,
    // amount: totalAmountCurrentMonth,
    percentage: percentageChange.toFixed() + "%",
  };
};

const sendUsersFullData = (users) => {
  // Get current date
  let currentDate = new Date();

  // Function to get the start and end dates of the previous month
  function getPreviousMonthDates() {
    let firstDayOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    let lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth - 1);
    let firstDayOfPreviousMonth = new Date(
      lastDayOfPreviousMonth.getFullYear(),
      lastDayOfPreviousMonth.getMonth(),
      1
    );
    return {
      firstDay: firstDayOfPreviousMonth,
      lastDay: lastDayOfPreviousMonth,
    };
  }

  // Get start and end dates of the previous month
  let previousMonthDates = getPreviousMonthDates();

  // Filter users created in the current month
  let usersCurrentMonth = users.filter((user) => {
    return (
      user.createdAt.getMonth() === currentDate.getMonth() &&
      user.createdAt.getFullYear() === currentDate.getFullYear()
    );
  });

  // Filter users created in the previous month
  let usersPreviousMonth = users.filter((user) => {
    let userDate = new Date(user.createdAt);
    return (
      userDate >= previousMonthDates.firstDay &&
      userDate <= previousMonthDates.lastDay
    );
  });

  // Calculate percentage growth
  let percentageGrowth;
  let usersLastMonth = usersPreviousMonth.length;
  if (usersLastMonth !== 0) {
    percentageGrowth =
      ((usersCurrentMonth.length - usersLastMonth) / usersLastMonth) * 100;
  } else {
    percentageGrowth = usersCurrentMonth.length !== 0 ? 100 : 0; // Handle division by zero case
  }
  return {
    total: users.length,
    // amount: totalAmountCurrentMonth,
    percentage: percentageGrowth.toFixed() + "%",
  };
};

const sendItemsFullData = (items) => {
  // Get current date
  const currentDate = new Date();
  // Get current month and year
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-based index
  const currentYear = currentDate.getFullYear();

  // Filter items created in the current month
  const currentMonthItems = items.filter((item) => {
    const createdAtDate = new Date(item.createdAt);
    return (
      createdAtDate.getMonth() + 1 === currentMonth &&
      createdAtDate.getFullYear() === currentYear
    );
  });

  // Total available food items in the current month
  const totalAvailableItems = currentMonthItems.length;

  // To calculate growth percentage, you would typically need historical data
  // For demonstration purposes, let's assume previous month's count
  const previousMonthItemsCount = 0; // Placeholder for previous month's count

  // Calculate percentage growth
  let percentageGrowth = 0;
  if (previousMonthItemsCount !== 0) {
    percentageGrowth =
      ((totalAvailableItems - previousMonthItemsCount) /
        previousMonthItemsCount) *
      100;
  } else {
    // Handle division by zero or when no previous data is available
    // This depends on your business logic or data availability
    // For simplicity, if no previous data, growth is 100% (since it's from 0 to something)
    if (totalAvailableItems > 0) {
      percentageGrowth = 100;
    }
  }

  // Prepare and return the data you want to send
  const dataToSend = {
    total: totalAvailableItems,
    percentage: percentageGrowth + "%",
    // Any other data you may want to include
  };

  // Return or use the data as needed
  return dataToSend;
};

const generateOrdersYearChartData = (orders) => {
  // Initialize yearData array for 12 months, starting from January (month 0) to December (month 11)
  const yearData = Array.from({ length: 12 }, (_, month) => ({
    year: moment().year(), // Get the current year
    month: moment().month(month).format("MMM"), // Short month name (Jan, Feb, ..., Dec)
    count: 0,
  }));

  // Iterate through each order and increment the count for the corresponding month
  orders.forEach((order) => {
    const createdAtMonth = moment(order.createdAt).month(); // Get the month index (0-11)
    yearData[createdAtMonth].count++;
  });

  return yearData;
};

const generateUsersYearChartData = (users) => {
  const yearData = Array.from({ length: 12 }, (_, month) => ({
    year: moment().year(), // Get the current year
    month: moment().month(month).format("MMM"), // Short month name (Jan, Feb, ..., Dec)
    count: 0,
  }));

  // Iterate through each user and increment the count for the corresponding month
  users.forEach((user) => {
    const createdAtMonth = moment(user.createdAt).month(); // Get the month index (0-11)
    yearData[createdAtMonth].count++;
  });

  return yearData;
};

module.exports = {
  sendOrdersFullData,
  sendUsersFullData,
  sendItemsFullData,
  generateOrdersYearChartData,
  generateUsersYearChartData,
};
