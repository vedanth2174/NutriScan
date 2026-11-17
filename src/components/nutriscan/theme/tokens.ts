export const tokens = {
  color: {
    canvas: '#0B0B0C',
    surface: '#171719',
    elevated: '#1C1C1E',
    subtle: '#232326',
    disabled: '#2A2A2D',
    text: '#F7F7F5',
    muted: '#8E8E93',
    accent: '#D4F06B',
    protein: '#B58CFF',
    carbs: '#FFB454',
    fat: '#2F80FF',
    calorie: '#3DDBB0',
    water: '#4FC3F7',
    danger: '#FF5D5D',
    success: '#12A05C',
  },
  radius: { card: 26, control: 18, pill: 999 },
  space: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  type: { display: 36, title: 26, heading: 20, body: 15, caption: 12 },
} as const

export type ThemeMode = 'dark' | 'light'
