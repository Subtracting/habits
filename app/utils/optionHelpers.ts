import type { Option } from '@/types/option.types';

export const createOption = (label: string): Option => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});
