"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { fetchFormSubmissions, createFromSubmission } from '../../api/FormsApi';
import {
    DEFAULT_MODAL_FORM,
    FORM_THEME,
    PAGE_LIMIT,
} from './formConstants';
import {
    buildInitialModalForm,
    buildModalPayload,
} from './formUtils';
import FormSearchFilters from './FormSearchFilters';
import FormPagination from './FormPagination';
import SubmissionCard from './SubmissionCard';
import CreateFromSubmissionModal from './CreateFromSubmissionModal';

const SubmittedForms = () => {
    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [modalForm, setModalForm] = useState(DEFAULT_MODAL_FORM);
    const [isSubmittingModal, setIsSubmittingModal] = useState(false);
    const [modalError, setModalError] = useState('');

    const menuRefs = useRef({});

    const loadSubmissions = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const data = await fetchFormSubmissions({
                page: currentPage,
                limit: PAGE_LIMIT,
                search: searchQuery,
                type: typeFilter,
            });
            if (data.success) {
                setSubmissions(data.data.items);
                setPagination(data.data.pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch form submissions');
            console.error('Error fetching submissions:', err);
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery, typeFilter]);

    useEffect(() => {
        loadSubmissions();
    }, [loadSubmissions]);

    useEffect(() => {
        if (!openMenuId) return;

        const handleClickOutside = (e) => {
            const ref = menuRefs.current[openMenuId];
            if (ref && !ref.contains(e.target)) setOpenMenuId(null);
        };
        const handleEscape = (e) => {
            if (e.key === 'Escape') setOpenMenuId(null);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [openMenuId]);

    const closeModal = useCallback(() => {
        if (isSubmittingModal) return;
        setActiveModal(null);
        setModalError('');
    }, [isSubmittingModal]);

    useEffect(() => {
        if (!activeModal) return;
        const handleEscape = (e) => {
            if (e.key === 'Escape') closeModal();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [activeModal, closeModal]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const formTypes = useMemo(
        () => [...new Set(submissions.map((sub) => sub.formType).filter(Boolean))].sort(),
        [submissions]
    );

    const openCreateModal = (mode, submission) => {
        setOpenMenuId(null);
        setModalError('');
        setModalForm(buildInitialModalForm(submission));
        setActiveModal({ mode, submission });
    };

    const handleModalFormChange = (field, value) => {
        setModalForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        if (!activeModal) return;

        setIsSubmittingModal(true);
        setModalError('');

        const { mode, submission } = activeModal;

        try {
            const payload = buildModalPayload(mode, submission, modalForm);
            const data = await createFromSubmission(mode, payload);

            if (data.success) {
                setActiveModal(null);
                setModalForm(DEFAULT_MODAL_FORM);
            } else {
                setModalError(data.message || `Failed to create ${mode}`);
            }
        } catch (err) {
            setModalError(
                err.response?.data?.message || `Failed to create ${mode}. Please try again.`
            );
        } finally {
            setIsSubmittingModal(false);
        }
    };

    const serviceRequestCount = submissions.filter((s) => s.formType === 'Request a Service').length;
    const questionCount = submissions.filter((s) => s.formType === 'Ask a Question').length;

    return (
        <div
            className="max-w-7xl mx-auto p-6"
            style={{ backgroundColor: FORM_THEME.pageBg, minHeight: '100vh' }}
        >
            <header className="mb-8">
                <h1 className="text-3xl font-semibold" style={{ color: FORM_THEME.text }}>
                    Form submissions
                </h1>
                <p className="mt-1.5" style={{ color: FORM_THEME.textMuted }}>
                    Everyone who&apos;s reached out, all in one friendly place
                </p>
            </header>

            <FormSearchFilters
                searchInput={searchInput}
                searchQuery={searchQuery}
                typeFilter={typeFilter}
                formTypes={formTypes}
                onSearchInputChange={setSearchInput}
                onSearch={handleSearch}
                onClearSearch={() => {
                    setSearchInput('');
                    setSearchQuery('');
                    setCurrentPage(1);
                }}
                onTypeFilterChange={(type) => {
                    setTypeFilter(type);
                    setCurrentPage(1);
                }}
                onClearTypeFilter={() => {
                    setTypeFilter('');
                    setCurrentPage(1);
                }}
            />

            {error && (
                <div
                    className="px-4 py-3 rounded-xl mb-6 text-sm"
                    style={{
                        backgroundColor: FORM_THEME.errorBg,
                        color: FORM_THEME.errorText,
                        border: `1px solid ${FORM_THEME.errorBorder}`,
                    }}
                >
                    {error}
                </div>
            )}

            {isLoading && submissions.length === 0 && (
                <div className="text-center py-20" style={{ color: FORM_THEME.textLight }}>
                    Gathering the submissions…
                </div>
            )}

            {pagination && !isLoading && submissions.length > 0 && (
                <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
                    <div className="text-sm" style={{ color: FORM_THEME.textMuted }}>
                        <span className="font-semibold" style={{ color: FORM_THEME.text }}>
                            {pagination.total}
                        </span>{' '}
                        {pagination.total === 1 ? 'submission' : 'submissions'}
                        {searchQuery || typeFilter ? ' match' : ' total'}
                    </div>
                    <div className="flex gap-4 text-xs" style={{ color: FORM_THEME.textLight }}>
                        <span>
                            <span className="font-semibold" style={{ color: '#7A746A' }}>
                                {serviceRequestCount}
                            </span>{' '}
                            service requests
                        </span>
                        <span>
                            <span className="font-semibold" style={{ color: '#7A746A' }}>
                                {questionCount}
                            </span>{' '}
                            questions
                        </span>
                    </div>
                </div>
            )}

            {!isLoading && submissions.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    {submissions.map((submission) => (
                        <SubmissionCard
                            key={submission._id}
                            submission={submission}
                            isMenuOpen={openMenuId === submission._id}
                            menuRef={(el) => { menuRefs.current[submission._id] = el; }}
                            onToggleMenu={() =>
                                setOpenMenuId((prev) => (prev === submission._id ? null : submission._id))
                            }
                            onCreate={openCreateModal}
                        />
                    ))}
                </div>
            )}

            {!isLoading && submissions.length === 0 && (
                <EmptyState hasFilters={Boolean(searchQuery || typeFilter)} />
            )}

            <FormPagination
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />

            <CreateFromSubmissionModal
                activeModal={activeModal}
                modalForm={modalForm}
                modalError={modalError}
                isSubmitting={isSubmittingModal}
                onClose={closeModal}
                onSubmit={handleModalSubmit}
                onFormChange={handleModalFormChange}
            />
        </div>
    );
};

function EmptyState({ hasFilters }) {
    return (
        <div
            className="text-center py-20 rounded-2xl"
            style={{ backgroundColor: FORM_THEME.surface, border: `1px dashed ${FORM_THEME.border}` }}
        >
            <div
                className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: FORM_THEME.surfaceMuted }}
            >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: '#B5AFA1' }}>
                    <path d="M9 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <h3 className="text-lg font-medium mb-1.5" style={{ color: FORM_THEME.text }}>
                {hasFilters ? 'Nothing matches yet' : 'No submissions yet'}
            </h3>
            <p style={{ color: FORM_THEME.textMuted }}>
                {hasFilters
                    ? 'Try a different search term or clear the filter'
                    : 'New form submissions will show up here as they come in'}
            </p>
        </div>
    );
}

export default SubmittedForms;
