// 12 months of realistic MRR growth data
export const revenueData = [
  { month: 'Jan', revenue: 42000,  expenses: 28000, profit: 14000 },
  { month: 'Feb', revenue: 48500,  expenses: 30000, profit: 18500 },
  { month: 'Mar', revenue: 51200,  expenses: 31500, profit: 19700 },
  { month: 'Apr', revenue: 55800,  expenses: 33000, profit: 22800 },
  { month: 'May', revenue: 61300,  expenses: 34200, profit: 27100 },
  { month: 'Jun', revenue: 58900,  expenses: 35000, profit: 23900 },
  { month: 'Jul', revenue: 67400,  expenses: 36800, profit: 30600 },
  { month: 'Aug', revenue: 72100,  expenses: 38000, profit: 34100 },
  { month: 'Sep', revenue: 69800,  expenses: 37500, profit: 32300 },
  { month: 'Oct', revenue: 78500,  expenses: 40000, profit: 38500 },
  { month: 'Nov', revenue: 84200,  expenses: 41500, profit: 42700 },
  { month: 'Dec', revenue: 91600,  expenses: 43000, profit: 48600 },
]

export const userGrowthData = [
  { month: 'Jan', users: 1200,  newUsers: 340,  churned: 80  },
  { month: 'Feb', users: 1460,  newUsers: 380,  churned: 120 },
  { month: 'Mar', users: 1720,  newUsers: 420,  churned: 160 },
  { month: 'Apr', users: 1980,  newUsers: 490,  churned: 230 },
  { month: 'May', users: 2340,  newUsers: 560,  churned: 200 },
  { month: 'Jun', users: 2700,  newUsers: 610,  churned: 250 },
  { month: 'Jul', users: 3060,  newUsers: 680,  churned: 320 },
  { month: 'Aug', users: 3420,  newUsers: 740,  churned: 380 },
  { month: 'Sep', users: 3780,  newUsers: 710,  churned: 350 },
  { month: 'Oct', users: 4140,  newUsers: 820,  churned: 460 },
  { month: 'Nov', users: 4500,  newUsers: 890,  churned: 530 },
  { month: 'Dec', users: 4860,  newUsers: 960,  churned: 600 },
]

export const salesData = [
  { day: 'Mon', sales: 4200 },
  { day: 'Tue', sales: 5800 },
  { day: 'Wed', sales: 4900 },
  { day: 'Thu', sales: 7100 },
  { day: 'Fri', sales: 8400 },
  { day: 'Sat', sales: 6200 },
  { day: 'Sun', sales: 3800 },
]

export const conversionFunnelData = [
  { stage: 'Visitors',   value: 100000 },
  { stage: 'Sign-ups',   value: 22400  },
  { stage: 'Activated',  value: 14800  },
  { stage: 'Paid',       value: 6200   },
  { stage: 'Retained',   value: 4860   },
]

export const kpiData = {
  revenue: {
    current:  91600,
    previous: 84200,
    change:   8.8,
    sparkline: [42000, 48500, 51200, 55800, 61300, 58900, 67400, 72100, 69800, 78500, 84200, 91600],
  },
  users: {
    current:  4860,
    previous: 4500,
    change:   8.0,
    sparkline: [1200, 1460, 1720, 1980, 2340, 2700, 3060, 3420, 3780, 4140, 4500, 4860],
  },
  sales: {
    current:  1284,
    previous: 1140,
    change:   12.6,
    sparkline: [820, 880, 940, 980, 1040, 1100, 1120, 1160, 1200, 1220, 1140, 1284],
  },
  conversion: {
    current:  4.86,
    previous: 4.50,
    change:   8.0,
    sparkline: [3.2, 3.5, 3.8, 4.0, 4.2, 4.1, 4.3, 4.5, 4.4, 4.6, 4.5, 4.86],
  },
}
