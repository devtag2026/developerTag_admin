import { FORM_THEME } from './formConstants';
import { focusBorder, blurBorder } from './formStyles';
import { stripeColorForType } from './formUtils';

export default function FormSearchFilters({
    searchInput,
    searchQuery,
    typeFilter,
    formTypes,
    onSearchInputChange,
    onSearch,
    onClearSearch,
    onTypeFilterChange,
    onClearTypeFilter,
}) {
    return (
        <div className="mb-7 space-y-3">
            <form onSubmit={onSearch} className="flex gap-3 items-center flex-wrap">
                <div className="flex-1 min-w-[280px] relative">
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="absolute left-3.5 top-1/2 -translate-y-1/2"
                        style={{ color: FORM_THEME.textLight }}
                    >
                        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search by name, email, or description…"
                        value={searchInput}
                        onChange={(e) => onSearchInputChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none transition-colors"
                        style={{
                            border: `1.5px solid ${FORM_THEME.border}`,
                            color: FORM_THEME.text,
                            backgroundColor: FORM_THEME.surface,
                        }}
                        onFocus={focusBorder}
                        onBlur={blurBorder}
                    />
                </div>
                <button
                    type="submit"
                    className="text-white px-5 py-2.5 rounded-xl transition-colors font-medium hover:bg-[#009689]"
                    style={{ backgroundColor: FORM_THEME.accent }}
                >
                    Search
                </button>
                {searchQuery && (
                    <button
                        type="button"
                        onClick={onClearSearch}
                        className="px-4 py-2.5 rounded-xl transition-colors font-medium"
                        style={{ color: FORM_THEME.textMuted, backgroundColor: FORM_THEME.surfaceMuted }}
                    >
                        Clear
                    </button>
                )}
            </form>

            <div className="flex gap-3 items-center flex-wrap">
                <span className="text-sm font-medium" style={{ color: FORM_THEME.textMuted }}>
                    Filter by type
                </span>
                <FilterChip label="All" active={typeFilter === ''} onClick={onClearTypeFilter} />
                {formTypes.map((type) => (
                    <FilterChip
                        key={type}
                        label={type}
                        active={typeFilter === type}
                        onClick={() => onTypeFilterChange(type)}
                        dotColor={stripeColorForType(type)}
                    />
                ))}
            </div>

            {(searchQuery || typeFilter) && (
                <div className="text-sm" style={{ color: FORM_THEME.textLight }}>
                    {searchQuery && <span>Searching &quot;{searchQuery}&quot;</span>}
                    {searchQuery && typeFilter && <span> · </span>}
                    {typeFilter && <span>Showing &quot;{typeFilter}&quot;</span>}
                </div>
            )}
        </div>
    );
}

function FilterChip({ label, active, onClick, dotColor }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={
                active
                    ? { backgroundColor: FORM_THEME.text, color: FORM_THEME.surface }
                    : { backgroundColor: FORM_THEME.surfaceMuted, color: FORM_THEME.textMuted }
            }
        >
            {dotColor && (
                <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: dotColor }}
                />
            )}
            {label}
        </button>
    );
}
