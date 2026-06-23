import { useState } from 'react';
import {
    avatarColorForName,
    formatBudget,
    formatDate,
    initialsForName,
    stripeColorForType,
} from './formUtils';
import { FORM_THEME } from './formConstants';

const MENU_ITEMS = [
    { mode: 'proposal', label: 'Create proposal' },
    { mode: 'contract', label: 'Create contract' }
];

export default function SubmissionCard({
    submission,
    isMenuOpen,
    menuRef,
    onToggleMenu,
    onCreate,
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    const stripeColor = stripeColorForType(submission.formType);
    const avatarColor = avatarColorForName(submission.name);
    const description = submission.description || '';
    const showReadMore = description.length > 90;

    return (
        <div
            className="relative rounded-2xl overflow-hidden transition-shadow hover:shadow-md overflow-y-auto"
            style={{
                backgroundColor: FORM_THEME.surface,
                border: `1px solid ${FORM_THEME.border}`,
                boxShadow: '0 1px 2px rgba(42,40,38,0.03)',
            }}
        >
            <div className="pl-6 pr-5 py-5">
                <header className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-start gap-3 min-w-0">
                        <div
                            className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                            style={{ backgroundColor: avatarColor }}
                        >
                            {initialsForName(submission.name)}
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold truncate" style={{ color: FORM_THEME.text }}>
                                {submission.name || 'No name given'}
                            </div>
                            <a
                                href={`mailto:${submission.email}`}
                                className="text-sm truncate block transition-colors hover:text-[#00bba7]"
                                style={{ color: FORM_THEME.textLight }}
                            >
                                {submission.email || 'No email given'}
                            </a>
                        </div>
                    </div>
                    <time
                        className="text-xs whitespace-nowrap flex-shrink-0 pt-1.5"
                        style={{ color: '#C9C3B8' }}
                        dateTime={submission.createdAt}
                    >
                        {formatDate(submission.createdAt)}
                    </time>
                </header>

                <div className="flex items-center gap-2 flex-wrap mb-3.5">
                    <TagPill color={stripeColor}>{submission.formType || 'General'}</TagPill>
                    {submission.projectGoal && (
                        <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: FORM_THEME.surfaceMuted, color: '#7A746A' }}
                        >
                            {submission.projectGoal}
                        </span>
                    )}
                    {submission.budget && (
                        <span
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                            style={{ backgroundColor: '#FBF0E2', color: '#B97A2C' }}
                        >
                            {formatBudget(submission.budget)}
                        </span>
                    )}
                </div>

                {submission.expertiseNeeded && (
                    <p className="text-sm mb-2" style={{ color: '#7A746A' }}>
                        <span style={{ color: FORM_THEME.textLight }}>Looking for: </span>
                        {submission.expertiseNeeded}
                    </p>
                )}

                {description && (
                    <div className="mb-4">
                        <p
                            className="text-sm leading-relaxed"
                            style={{
                                color: '#5C5750',
                                display: isExpanded ? 'block' : '-webkit-box',
                                WebkitLineClamp: isExpanded ? 'unset' : 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: isExpanded ? 'visible' : 'hidden',
                            }}
                        >
                            {description}
                        </p>
                        {showReadMore && (
                            <button
                                type="button"
                                onClick={() => setIsExpanded((prev) => !prev)}
                                className="text-xs font-medium mt-1 hover:underline"
                                style={{ color: FORM_THEME.accent }}
                            >
                                {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                        )}
                    </div>
                )}

                <footer className="flex justify-end pt-1" style={{ borderTop: '1px solid #F5F3EF' }}>
                    <div className="inline-block relative mt-3" ref={menuRef}>
                        <button
                            type="button"
                            onClick={onToggleMenu}
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors hover:bg-[#009689]"
                            style={{ backgroundColor: FORM_THEME.accent }}
                        >
                            Create
                            <ChevronIcon open={isMenuOpen} />
                        </button>

                        {isMenuOpen && (
                            <div
                                className="absolute right-0 mt-2 w-52 rounded-xl shadow-lg z-10 overflow-hidden"
                                style={{
                                    backgroundColor: FORM_THEME.surface,
                                    border: `1px solid ${FORM_THEME.border}`,
                                }}
                            >
                                {MENU_ITEMS.map((item, index) => (
                                    <button
                                        key={item.mode}
                                        type="button"
                                        onClick={() => onCreate(item.mode, submission)}
                                        className="w-full text-left flex items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-[#FBFAF8]"
                                        style={{
                                            color: '#5C5750',
                                            borderTop: index > 0 ? '1px solid #F5F3EF' : undefined,
                                        }}
                                    >
                                        <DocumentIcon />
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
}

function TagPill({ color, children }) {
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${color}1A`, color }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {children}
        </span>
    );
}

function ChevronIcon({ open }) {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        >
            <path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function DocumentIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: '#B5AFA1' }} className="flex-shrink-0">
            <path d="M9 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 13h6M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}