export type Meal = {
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  items: string[];
};

export const MEALS: Meal[] = [
  {
    name: 'Breakfast',
    startHour: 8,
    startMinute: 0,
    endHour: 10,
    endMinute: 0,
    items: ['Upma', 'Poha', 'Idli', 'Paratha', 'Aloo Bhaji', 'Chai'],
  },
  {
    name: 'Lunch',
    startHour: 12,
    startMinute: 30,
    endHour: 14,
    endMinute: 0,
    items: ['Veg Biryani', 'Dal Makhani', 'Mixed Veg', 'Roti', 'Salad'],
  },
  {
    name: 'Dinner',
    startHour: 19,
    startMinute: 0,
    endHour: 21,
    endMinute: 0,
    items: ['Paneer Butter Masala', 'Chapati', 'Dal Tadka', 'Rice', 'Raita'],
  },
];
