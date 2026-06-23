import { FORM_THEME } from './formConstants';

export default function FormPagination({ pagination, currentPage, onPageChange }) {
    if (!pagination || pagination.totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center gap-1.5">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 text-sm rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ color: '#7A746A', backgroundColor: FORM_THEME.surfaceMuted }}
            >
                Previous
            </button>

            <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className="w-9 h-9 text-sm rounded-full transition-colors font-medium"
                        style={
                            page === currentPage
                                ? { backgroundColor: FORM_THEME.accent, color: FORM_THEME.surface }
                                : { color: FORM_THEME.textMuted, backgroundColor: 'transparent' }
                        }
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 text-sm rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ color: '#7A746A', backgroundColor: FORM_THEME.surfaceMuted }}
            >
                Next
            </button>
        </div>
    );
}
