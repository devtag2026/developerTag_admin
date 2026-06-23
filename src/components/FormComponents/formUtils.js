import { TYPE_STRIPE_COLORS } from './formConstants';

/* =========================
   HASH + COLORS
========================= */

const hashString = (value) => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
};

export const colorFromString = (value, fallback = '#C9C3B8') => {
    if (!value) return fallback;
    return TYPE_STRIPE_COLORS[hashString(value) % TYPE_STRIPE_COLORS.length];
};

export const stripeColorForType = (type) => colorFromString(type);

export const avatarColorForName = (name) => colorFromString(name);

export const initialsForName = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/* =========================
   DATE HELPERS
========================= */

export const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

export const formatDateForInput = (date) => {
    if (!date || date === 'null' || date === 'undefined') return '';

    const d = new Date(date);
    if (isNaN(d.getTime())) return '';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

/* =========================
   AMOUNT PARSER (SAFE)
========================= */

export const parseContractAmount = (amount) => {
    const num = parseFloat(String(amount).replace(/[^0-9.]/g, ''));
    return Number.isFinite(num) ? num : 0;
};

/* =========================
   BUDGET FORMATTING (FIXED)
========================= */

const BUDGET_CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    PKR: 'Rs',
    INR: '₹',
};

const NUMBER_FORMATTER = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
});

const suffixMultiplier = (suffix) => {
    if (!suffix) return 1;
    const s = suffix.toLowerCase();
    if (s === 'k') return 1_000;
    if (s === 'm') return 1_000_000;
    return 1;
};

/**
 * SAFE RULES:
 * 1. Never assume range unless "-" exists
 * 2. Never break partial typing
 * 3. Never misinterpret formatted strings
 */
export const formatBudget = (budget) => {
    if (!budget) return '';

    const raw = String(budget).trim();

    // detect currency
    const currencyMatch = raw.match(/USD|EUR|GBP|PKR|INR|\$|€|£/i);
    const symbol = currencyMatch
        ? BUDGET_CURRENCY_SYMBOLS[currencyMatch[0].toUpperCase()] || currencyMatch[0]
        : '$';

  
    const cleaned = raw.replace(/,/g, '');

    // extract numbers safely
    const numberPattern = /(\d+(?:\.\d+)?)\s*(k|m)?/gi;
    const matches = [...cleaned.matchAll(numberPattern)];

    if (matches.length === 0) return raw;

    const toValue = ([, num, suffix]) =>
        parseFloat(num) * suffixMultiplier(suffix);

    const formatNumber = (val) => NUMBER_FORMATTER.format(val);

    const isRange = cleaned.includes('-') && matches.length >= 2;

    if (isRange) {
        const [first, second] = matches;
        const min = toValue(first);
        const max = toValue(second);
        return `${symbol}${formatNumber(min)}-${formatNumber(max)}`;
    }

    const value = toValue(matches[0]);
    return `${symbol}${formatNumber(value)}`;
};

/* =========================
   MODAL PAYLOAD BUILDER
========================= */

export const buildModalPayload = (mode, submission, modalForm) => {
    if (mode === 'proposal') {
        return {
            formId: submission._id,
            title: modalForm.title,
            amount: modalForm.amount,
            notes: modalForm.notes,
        };
    }

    if (mode === 'contract') {
        const today = formatDateForInput(new Date());
        const defaultEnd = formatDateForInput(
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        );

        const revisions = Number(modalForm.revisions);
        const milestones = (modalForm.milestones || []).map((m) => ({
            title: m.title.trim(),
            description: m.deliverable?.trim() || '',
            amount: parseContractAmount(m.amount),
            ...(m.dueDate ? { dueDate: m.dueDate } : {}),
        }));

        const payload = {
            projectName: modalForm.title || submission.projectGoal,
            clientName: submission.name,
            clientEmail: submission.email,
            contractAmount: parseContractAmount(modalForm.amount),
            currency: 'usd',
            startDate: modalForm.startDate || today,
            endDate: modalForm.endDate || defaultEnd,
            paymentTerms: modalForm.paymentTerms || 'milestone',
            milestones,
        };

        if (modalForm.serviceType?.trim()) {
            payload.serviceType = modalForm.serviceType.trim();
        }

        if (Number.isFinite(revisions)) {
            payload.revisions = revisions;
        }

        if (modalForm.scopeOfWork?.trim()) {
            payload.scopeOfWork = modalForm.scopeOfWork.trim();
        }

        if (modalForm.notes?.trim()) {
            payload.notes = modalForm.notes.trim();
        }

        return payload;
    }

    return { formId: submission._id };
};

/* =========================
   INITIAL FORM STATE
========================= */

export const buildInitialModalForm = (submission) => ({
    title: submission.projectGoal || '',
    amount: submission.budget || '',
    notes: '',
    startDate: formatDateForInput(submission.startDate),
    endDate: formatDateForInput(submission.endDate),
    paymentTerms: 'milestone',
    serviceType: submission.expertiseNeeded || '',
    revisions: '2',
    scopeOfWork: '',
    milestones: [
        {
            id: `m-${Date.now()}-1`,
            title: '',
            amount: '',
            dueDate: '',
            deliverable: '',
        },
    ],
});