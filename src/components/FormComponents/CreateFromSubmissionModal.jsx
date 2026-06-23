import {
    MODAL_COPY,
    PAYMENT_TERMS_OPTIONS,
    REVISION_OPTIONS,
    FORM_THEME,
} from './formConstants';
import {
    avatarColorForName,
    formatBudget,
    initialsForName,
} from './formUtils';
import { inputClassName, focusBorder, blurBorder } from './formStyles';
let milestoneIdCounter = 0;
function makeEmptyMilestone() {
    milestoneIdCounter += 1;
    return {
        id: `m-${Date.now()}-${milestoneIdCounter}`,
        title: '',
        amount: '',
        dueDate: '',
        deliverable: '',
    };
}

function parseAmount(value) {
    const num = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(num) ? num : 0;
}

function sumMilestoneAmounts(milestones) {
    return milestones.reduce((sum, m) => sum + parseAmount(m.amount), 0);
}

export default function CreateFromSubmissionModal({
    activeModal,
    modalForm,
    modalError,
    isSubmitting,
    onClose,
    onSubmit,
    onFormChange,
}) {
    if (!activeModal) return null;

    const { mode, submission } = activeModal;
    const copy = MODAL_COPY[mode];

    const milestones = modalForm.milestones && modalForm.milestones.length > 0
        ? modalForm.milestones
        : [makeEmptyMilestone()];

    const totalAmount = parseAmount(modalForm.amount);
    const milestonesTotal = sumMilestoneAmounts(milestones);
    const remaining = totalAmount - milestonesTotal;
    const isBalanced = totalAmount > 0 && Math.abs(remaining) < 0.005;

    const handleMilestoneChange = (id, field, value) => {
        const next = milestones.map((m) =>
            m.id === id ? { ...m, [field]: value } : m
        );
        onFormChange('milestones', next);
    };

    const handleAddMilestone = () => {
        onFormChange('milestones', [...milestones, makeEmptyMilestone()]);
    };

    const handleRemoveMilestone = (id) => {
        const next = milestones.filter((m) => m.id !== id);
        onFormChange('milestones', next.length > 0 ? next : [makeEmptyMilestone()]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'contract' && !isBalanced) {
            onFormChange('milestoneValidationError', formatRemainingMessage(remaining, totalAmount));
            return;
        }
        onFormChange('milestoneValidationError', null);
        onSubmit(e);
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(42,40,38,0.45)' }}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[100vh]"
                style={{ backgroundColor: FORM_THEME.surface }}
            >
                {/* ── Header ── */}
                <div
                    className="px-6 py-5 flex items-start justify-between"
                    style={{ borderBottom: '1px solid #F0EDE7' }}
                >
                    <div>
                        {mode === 'contract' && (
                            <div className="flex items-center gap-2 mb-1">
                                <span
                                    className="w-2 h-2 rounded-full inline-block"
                                    style={{ backgroundColor: FORM_THEME.accent }}
                                />
                                <span
                                    className="text-xs font-semibold tracking-widest uppercase"
                                    style={{ color: FORM_THEME.accent }}
                                >
                                    New contract
                                </span>
                            </div>
                        )}
                        <h2 className="text-lg font-semibold" style={{ color: FORM_THEME.text }}>
                            {copy.heading}
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: FORM_THEME.textLight }}>
                            {copy.subheading}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="p-1.5 -mt-1 -mr-1 rounded-full transition-colors text-[#C9C3B8] hover:bg-[#F5F3EF] hover:text-[#7A746A]"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M18 6L6 18M6 6l12 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* ── Scrollable body ── */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1 max-h-[70vh]">

                        {/* Client summary */}
                        <SubmissionSummary submission={submission} />

                        {/* ── Contract details section ── */}
                        {mode === 'contract' && (
                            <SectionLabel label="Contract details" />
                        )}

                        {/* Title */}
                        <FormField label="Contract title">
                            <input
                                type="text"
                                required
                                value={modalForm.title}
                                onChange={(e) => onFormChange('title', e.target.value)}
                                placeholder="e.g. Brand identity & web design — Q3 2026"
                                className={inputClassName}
                                onFocus={focusBorder}
                                onBlur={blurBorder}
                            />
                        </FormField>

                        {/* Value + Currency */}
                        <div className="grid gap-3">
                            <FormField label={copy.amountLabel}>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formatBudget(modalForm.amount)}
                                        onChange={(e) => onFormChange('amount', e.target.value)}
                                        placeholder="e.g. $5,000"
                                        className={inputClassName}
                                        style={{ paddingLeft: '1.5rem' }}
                                        onFocus={focusBorder}
                                        onBlur={blurBorder}
                                    />
                                </div>
                            </FormField>
                        </div>

                        {/* Service type (contract only) */}
                        {mode === 'contract' && (
                            <FormField label="Service type">
                                <input
                                    type="text"
                                    value={modalForm.serviceType || ''}
                                    onChange={(e) => onFormChange('serviceType', e.target.value)}
                                    className={inputClassName}
                                    onFocus={focusBorder}
                                    onBlur={blurBorder}
                                />
                            </FormField>
                        )}

                        {/* Contract-specific fields */}
                        {mode === 'contract' && (
                            <ContractFields
                                modalForm={modalForm}
                                onFormChange={onFormChange}
                                milestones={milestones}
                                totalAmount={totalAmount}
                                milestonesTotal={milestonesTotal}
                                remaining={remaining}
                                isBalanced={isBalanced}
                                onMilestoneChange={handleMilestoneChange}
                                onAddMilestone={handleAddMilestone}
                                onRemoveMilestone={handleRemoveMilestone}
                            />
                        )}

                        {/* Milestone balance error */}
                        {mode === 'contract' && modalForm.milestoneValidationError && (
                            <div
                                className="px-3.5 py-2.5 rounded-xl text-sm"
                                style={{
                                    backgroundColor: FORM_THEME.errorBg,
                                    color: FORM_THEME.errorText,
                                    border: `1px solid ${FORM_THEME.errorBorder}`,
                                }}
                            >
                                {modalForm.milestoneValidationError}
                            </div>
                        )}

                        {/* Error */}
                        {modalError && (
                            <div
                                className="px-3.5 py-2.5 rounded-xl text-sm"
                                style={{
                                    backgroundColor: FORM_THEME.errorBg,
                                    color: FORM_THEME.errorText,
                                    border: `1px solid ${FORM_THEME.errorBorder}`,
                                }}
                            >
                                {modalError}
                            </div>
                        )}
                    </div>

                    {/* ── Footer ── */}
                    <div
                        className="px-6 py-4 flex items-center justify-between gap-3"
                        style={{ backgroundColor: FORM_THEME.pageBg, borderTop: '1px solid #F0EDE7' }}
                    >
                        {/* Trust badge */}
                        <div className="flex items-center gap-1.5 text-xs" style={{ color: FORM_THEME.textLight }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                    d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M9 12l2 2 4-4"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Stored securely
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-50 text-[#7A746A] hover:bg-[#F0EDE7]"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-60 hover:bg-[#009689] flex items-center gap-2"
                                style={{ backgroundColor: FORM_THEME.accent }}
                            >
                                {mode === 'contract' && !isSubmitting && (
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path
                                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M14 2v6h6M9 13h6M9 17h4"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                )}
                                {isSubmitting ? 'Saving…' : copy.submitLabel}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function formatRemainingMessage(remaining, totalAmount) {
    if (totalAmount <= 0) {
        return 'Add a contract amount before assigning milestone amounts.';
    }
    if (remaining > 0) {
        return `Milestones don't add up yet — ${formatBudget(remaining)} of the contract amount is unassigned.`;
    }
    return `Milestones exceed the contract amount by ${formatBudget(remaining)}.`;
}

/* ─────────────────────────────────────────
   Contract-specific fields
───────────────────────────────────────── */
function ContractFields({
    modalForm,
    onFormChange,
    milestones,
    totalAmount,
    milestonesTotal,
    remaining,
    isBalanced,
    onMilestoneChange,
    onAddMilestone,
    onRemoveMilestone,
}) {
    return (
        <>
            {/* Payment terms section */}
            <SectionDivider />
            <SectionLabel label="Payment terms" />

            <div className="grid grid-cols-1 gap-3">
                <FormField label="Payment structure">
                    <select
                        value={modalForm.paymentTerms}
                        onChange={(e) => onFormChange('paymentTerms', e.target.value)}
                        className={inputClassName}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                    >
                        {PAYMENT_TERMS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </FormField>
            </div>

            {/* Timeline section */}
            <SectionDivider />
            <SectionLabel label="Project timeline" />

            <div className="grid grid-cols-2 gap-3">
                <FormField label="Start date">
                    <input
                        type="date"
                        value={modalForm.startDate || ''}
                        onChange={(e) => onFormChange('startDate', e.target.value)}
                        className={inputClassName}
                        style={{ colorScheme: 'light' }}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                    />
                </FormField>

                <FormField label="End date">
                    <input
                        type="date"
                        value={modalForm.endDate || ''}
                        onChange={(e) => onFormChange('endDate', e.target.value)}
                        className={inputClassName}
                        style={{ colorScheme: 'light' }}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                    />
                </FormField>
            </div>

            <FormField label="Revisions included">
                <select
                    value={modalForm.revisions || '2'}
                    onChange={(e) => onFormChange('revisions', e.target.value)}
                    className={inputClassName}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                >
                    {REVISION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </FormField>

            {/* Scope section */}
            <SectionDivider />
            <SectionLabel label="Scope & notes" />

            <FormField label="Scope of work" hint="Overall summary — milestones below cover the details">
                <textarea
                    value={modalForm.scopeOfWork || ''}
                    onChange={(e) => onFormChange('scopeOfWork', e.target.value)}
                    placeholder="Describe deliverables, e.g. 5-page website, logo suite, brand guidelines PDF…"
                    rows={3}
                    className={inputClassName}
                    style={{ resize: 'vertical', minHeight: '80px' }}
                    onFocus={focusBorder}
                    onBlur={blurBorder}
                />
            </FormField>

            {/* Milestones section */}
            <SectionDivider />
            <div className="flex items-baseline justify-between mb-1">
                <SectionLabel label="Milestones" />
                <MilestoneBalanceBadge
                    totalAmount={totalAmount}
                    milestonesTotal={milestonesTotal}
                    remaining={remaining}
                    isBalanced={isBalanced}
                />
            </div>

            <div className="space-y-3">
                {milestones.map((milestone, index) => (
                    <MilestoneCard
                        key={milestone.id}
                        index={index}
                        milestone={milestone}
                        canRemove={milestones.length > 1}
                        onChange={onMilestoneChange}
                        onRemove={onRemoveMilestone}
                    />
                ))}
            </div>

            <button
                type="button"
                onClick={onAddMilestone}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium border border-dashed transition-colors"
                style={{
                    borderColor: '#D9D4C8',
                    color: FORM_THEME.accent,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F3EF'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
                Add milestone
            </button>
        </>
    );
}

/* ─────────────────────────────────────────
   Milestone sub-components
───────────────────────────────────────── */
function MilestoneBalanceBadge({ totalAmount, milestonesTotal, remaining, isBalanced }) {
    if (totalAmount <= 0) {
        return (
            <span className="text-xs" style={{ color: FORM_THEME.textLight }}>
                Set a contract amount first
            </span>
        );
    }

    if (isBalanced) {
        return (
            <span
                className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#E6F4F1', color: '#0F6E56' }}
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                Fully allocated
            </span>
        );
    }
}

function MilestoneCard({ index, milestone, canRemove, onChange, onRemove }) {
    return (
        <div
            className="rounded-xl p-3.5"
            style={{ backgroundColor: FORM_THEME.pageBg, border: '1px solid #F0EDE7' }}
        >
            <div className="flex items-center justify-between mb-3">
                <span
                    className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: FORM_THEME.textLight, letterSpacing: '0.07em' }}
                >
                    Milestone {index + 1}
                </span>
                {canRemove && (
                    <button
                        type="button"
                        onClick={() => onRemove(milestone.id)}
                        aria-label={`Remove milestone ${index + 1}`}
                        className="p-1 rounded-full transition-colors text-[#C9C3B8] hover:bg-[#F0EDE7] hover:text-[#B3261E]"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                                d="M18 6L6 18M6 6l12 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                )}
            </div>

            <div className="space-y-3">
                <FormField label="Milestone title">
                    <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => onChange(milestone.id, 'title', e.target.value)}
                        placeholder="e.g. Homepage design concepts"
                        className={inputClassName}
                        style={{ backgroundColor: FORM_THEME.surface }}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                    />
                </FormField>

                <div className="grid grid-cols-2 gap-3">
                    <FormField label="Amount">
                        <input
                            type="text"
                            value={formatBudget(milestone.amount)}
                            onChange={(e) => onChange(milestone.id, 'amount', e.target.value)}
                            placeholder="e.g. $1,500"
                            className={inputClassName}
                            style={{ paddingLeft: '1.5rem', backgroundColor: FORM_THEME.surface }}
                            onFocus={focusBorder}
                            onBlur={blurBorder}
                        />
                    </FormField>

                    <FormField label="Due date">
                        <input
                            type="date"
                            value={milestone.dueDate || ''}
                            onChange={(e) => onChange(milestone.id, 'dueDate', e.target.value)}
                            className={inputClassName}
                            style={{ colorScheme: 'light', backgroundColor: FORM_THEME.surface }}
                            onFocus={focusBorder}
                            onBlur={blurBorder}
                        />
                    </FormField>
                </div>

                <FormField label="Deliverable" hint="What the client receives at this milestone">
                    <textarea
                        value={milestone.deliverable}
                        onChange={(e) => onChange(milestone.id, 'deliverable', e.target.value)}
                        placeholder="e.g. 3 homepage mockups (desktop + mobile) for review"
                        rows={2}
                        className={inputClassName}
                        style={{ resize: 'vertical', minHeight: '56px', backgroundColor: FORM_THEME.surface }}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                    />
                </FormField>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────
   Shared sub-components
───────────────────────────────────────── */
function SubmissionSummary({ submission }) {
    return (
        <div
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5"
            style={{ backgroundColor: FORM_THEME.pageBg }}
        >
            <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                style={{ backgroundColor: avatarColorForName(submission.name) }}
            >
                {initialsForName(submission.name)}
            </div>
            <div className="text-sm min-w-0 flex-1">
                <div className="font-medium truncate" style={{ color: FORM_THEME.text }}>
                    {submission.name || 'This submission'}
                </div>
                {submission.email && (
                    <div className="truncate" style={{ color: FORM_THEME.textLight }}>
                        {submission.email}
                    </div>
                )}
            </div>
            <span
                className="text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0"
                style={{ backgroundColor: '#E6F4F1', color: '#0F6E56' }}
            >
                New submission
            </span>
        </div>
    );
}

function SectionLabel({ label }) {
    return (
        <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: FORM_THEME.textLight, letterSpacing: '0.07em' }}
        >
            {label}
        </p>
    );
}

function SectionDivider() {
    return <hr style={{ border: 'none', borderTop: '1px solid #F0EDE7', margin: '4px 0' }} />;
}

function FormField({ label, hint, children }) {
    return (
        <div>
            <div className="flex items-baseline gap-2 mb-1.5">
                <label className="block text-sm font-medium" style={{ color: '#5C5750' }}>
                    {label}
                </label>
                {hint && (
                    <span className="text-xs" style={{ color: FORM_THEME.textLight }}>
                        {hint}
                    </span>
                )}
            </div>
            {children}
        </div>
    );
}