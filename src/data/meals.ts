export type Meal = {
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  items: string[];
  highlights?: string[]; // special dishes shown vertically

};

export const MEALS: Meal[] = [
  {
    name: 'Breakfast',
    startHour: 8,
    startMinute: 0,
    endHour: 10,
    endMinute: 0,
    items: ['Upma', 'Poha', 'Idli', 'Paratha', 'Aloo Bhaji', 'Chai'],
    highlights: ['Masala Dosa'],

  },
  {
    name: 'Lunch',
    startHour: 12,
    startMinute: 30,
    endHour: 14,
    endMinute: 0,
    items: ['Veg Biryani', 'Dal Makhani', 'Mixed Veg', 'Roti', 'Salad'],

    highlights: ['Gulab Jamun'],
  },
  {
    name: 'Snacks',
    startHour: 16,
    startMinute: 0,
    endHour: 17,
    endMinute: 0,
    items: ['Tea', 'Coffee', 'Puffs', 'Cookies'],
    highlights: ['Samosa'],

  },
  {
    name: 'Dinner',
    startHour: 19,
    startMinute: 0,
    endHour: 21,
    endMinute: 0,
    items: ['Paneer Butter Masala', 'Chapati', 'Dal Tadka', 'Rice', 'Raita'],
    highlights: ['Ice Cream'],

  },
];

export default MEALS;
