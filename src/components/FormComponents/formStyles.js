import { FORM_THEME } from './formConstants';

export const inputClassName =
    'w-full px-3.5 py-2.5 rounded-xl focus:outline-none transition-colors border-[1.5px] border-[#EDE9E3] text-[#2A2826]';

export const focusBorder = (e) => { e.target.style.borderColor = FORM_THEME.accent; };
export const blurBorder = (e) => { e.target.style.borderColor = FORM_THEME.border; };
