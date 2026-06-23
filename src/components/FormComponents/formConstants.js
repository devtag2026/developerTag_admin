export const PAGE_LIMIT = 10;

export const TYPE_STRIPE_COLORS = [
    '#00bba7',
    '#F0A04B',
    '#7C9885',
    '#C77B8C',
    '#6B8CAE',
];

export const PAYMENT_TERMS_OPTIONS = [
    { label: 'Milestone payments', value: 'milestone' },
    { label: 'Final payment', value: 'final-payment' },
    { label: 'Upfront', value: 'upfront' },
    { label: 'Installments', value: 'installments' },
];

export const MODAL_COPY = {
    proposal: {
        heading: 'Create project proposal',
        subheading: "Draft a proposal from what they've told us.",
        amountLabel: 'Proposed budget',
        submitLabel: 'Create proposal',
    },
    contract: {
        heading: 'Create contract',
        subheading: 'Set the terms and get this moving.',
        amountLabel: 'Contract value',
        submitLabel: 'Create contract',
    }
};

  
  export const SERVICE_TYPE_OPTIONS = [
    { value: 'web', label: 'Custom Website Development' },
    { value: 'uiux', label: 'UI/UX Design' },
    { value: 'marketing', label: 'Digital Marketing' },
    { value: 'frontend', label: 'Frontend Development' },
    { value: 'backend', label: 'Backend Development' },
    { value: 'ai', label: 'AI Solutions' },
    { value: 'mobile', label: 'Mobile App Development' },
    { value: 'other', label: 'Custom / Other' },
  ];
  
  export const REVISION_OPTIONS = [
    { value: '1', label: '1 round of revisions' },
    { value: '2', label: '2 rounds of revisions' },
    { value: '3', label: '3 rounds of revisions' },
    { value: 'unlimited', label: 'Unlimited revisions' },
  ];
export const DEFAULT_MODAL_FORM = {
    title: '',
    amount: '',
    notes: '',
    paymentTerms: 'milestone',
    startDate: '',
    endDate: '',
};

export const FORM_THEME = {
    pageBg: '#FBFAF8',
    text: '#2A2826',
    textMuted: '#8A8377',
    textLight: '#B5AFA1',
    border: '#EDE9E3',
    surface: '#FFFFFF',
    surfaceMuted: '#F0EDE7',
    accent: '#00bba7',
    accentHover: '#009689',
    errorBg: '#FBEAEA',
    errorText: '#A14B4B',
    errorBorder: '#F3D6D6',
};
