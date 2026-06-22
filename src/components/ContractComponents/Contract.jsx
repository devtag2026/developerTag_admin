"use client";
import React, { useState, useEffect } from 'react';
import API from '../../config/ApiConfig';

const STATUS_STYLES = {
    pending: { bg: '#FBF0E2', text: '#B97A2C', dot: '#F0A04B' },
    active: { bg: '#E6F5F3', text: '#00897A', dot: '#00bba7' },
    completed: { bg: '#EAF2EC', text: '#4F7858', dot: '#7C9885' },
    cancelled: { bg: '#FBEAEA', text: '#A14B4B', dot: '#C77B8C' },
    default: { bg: '#F0EDE7', text: '#7A746A', dot: '#C9C3B8' },
};

const MILESTONE_STATUS_STYLES = {
    pending_payment: { bg: '#FBF0E2', text: '#B97A2C', dot: '#F0A04B', label: 'Pending payment' },
    paid: { bg: '#E6F5F3', text: '#00897A', dot: '#00bba7', label: 'Paid' },
    in_progress: { bg: '#EAEFF5', text: '#3F6594', dot: '#6B8CAE', label: 'In progress' },
    completed: { bg: '#EAF2EC', text: '#4F7858', dot: '#7C9885', label: 'Completed' },
    default: { bg: '#F0EDE7', text: '#7A746A', dot: '#C9C3B8', label: 'Pending' },
};

const PAYMENT_TERMS_LABELS = {
    milestone: 'Milestone payments',
    'final-payment': 'Final payment',
    upfront: 'Upfront',
    installments: 'Installments',
};

const initialsForName = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AVATAR_COLORS = ['#00bba7', '#F0A04B', '#7C9885', '#C77B8C', '#6B8CAE'];

const avatarColorForName = (name) => {
    if (!name) return '#C9C3B8';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = (hash << 5) - hash + name.charCodeAt(i);
        hash |= 0;
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const statusStyle = (status) => STATUS_STYLES[status] || STATUS_STYLES.default;
const milestoneStatusStyle = (status) => MILESTONE_STATUS_STYLES[status] || MILESTONE_STATUS_STYLES.default;

const formatCurrency = (amount, currency) => {
    if (amount === null || amount === undefined) return '—';
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: (currency || 'usd').toUpperCase(),
            maximumFractionDigits: 0,
        }).format(amount);
    } catch {
        return `${(currency || '').toUpperCase()} ${amount}`;
    }
};

const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// ── Icons ─────────────────────────────────────────────────────────────────────

const IconSend = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconEdit = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconTrash = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconCalendar = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: '#B5AFA1' }}>
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const IconDoc = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: '#B5AFA1' }}>
        <path d="M16 3H4a1 1 0 00-1 1v16a1 1 0 001 1h12l4-4V4a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17v4M16 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 8h7M7 12h7M7 16h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconChevron = ({ open }) => (
    <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"
        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
    >
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconFlag = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ color: '#B5AFA1', flexShrink: 0 }}>
        <path d="M4 22V4M4 4h14l-3 4 3 4H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ── Delete Confirm Modal ───────────────────────────────────────────────────────

function DeleteConfirmModal({ contract, onConfirm, onCancel, isDeleting }) {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(42,40,38,0.45)' }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
        >
            <div
                className="rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
                style={{ backgroundColor: '#FFFFFF' }}
            >
                <div className="px-6 py-5" style={{ borderBottom: '1px solid #F0EDE7' }}>
                    <h2 className="text-base font-semibold" style={{ color: '#2A2826' }}>
                        Delete contract?
                    </h2>
                    <p className="text-sm mt-1" style={{ color: '#8A8377' }}>
                        <span className="font-medium" style={{ color: '#2A2826' }}>
                            {contract.projectName || 'This contract'}
                        </span>{' '}
                        will be permanently deleted. This cannot be undone.
                    </p>
                </div>
                <div
                    className="px-6 py-4 flex justify-end gap-3"
                    style={{ backgroundColor: '#FBFAF8' }}
                >
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
                        style={{ color: '#7A746A', backgroundColor: '#F0EDE7' }}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-60"
                        style={{ backgroundColor: '#C04A4A' }}
                    >
                        {isDeleting ? 'Deleting…' : 'Yes, delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

function EditContractModal({ contract, onClose, onSave, isSaving, saveError }) {
    const [form, setForm] = useState({
        projectName: contract.projectName || '',
        contractAmount: contract.contractAmount ?? '',
        paymentTerms: contract.paymentTerms || 'milestone',
        startDate: contract.startDate ? contract.startDate.slice(0, 10) : '',
        endDate: contract.endDate ? contract.endDate.slice(0, 10) : '',
    });

    const handleChange = (field, value) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    const inputStyle = {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '10px',
        border: '1px solid #E5E1DB',
        fontSize: '14px',
        color: '#2A2826',
        backgroundColor: '#FFFFFF',
        outline: 'none',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        color: '#5C5750',
        marginBottom: '6px',
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ backgroundColor: 'rgba(42,40,38,0.45)' }}
            onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
                style={{ backgroundColor: '#FFFFFF', maxHeight: '90vh' }}
            >
                {/* Header */}
                <div
                    className="px-6 py-5 flex items-start justify-between flex-shrink-0"
                    style={{ borderBottom: '1px solid #F0EDE7' }}
                >
                    <div>
                        <h2 className="text-base font-semibold" style={{ color: '#2A2826' }}>
                            Edit contract
                        </h2>
                        <p className="text-sm mt-0.5" style={{ color: '#8A8377' }}>
                            {contract.clientName || 'Update contract details'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="p-1.5 -mt-1 -mr-1 rounded-full"
                        style={{ color: '#C9C3B8' }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="px-6 py-5 space-y-4" style={{ overflowY: 'auto', flex: 1 }}>

                        <div>
                            <label style={labelStyle}>Project name</label>
                            <input
                                type="text"
                                required
                                value={form.projectName}
                                onChange={(e) => handleChange('projectName', e.target.value)}
                                placeholder="e.g. Website redesign"
                                style={inputStyle}
                                onFocus={(e) => (e.target.style.borderColor = '#00bba7')}
                                onBlur={(e) => (e.target.style.borderColor = '#E5E1DB')}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Contract amount</label>
                            <input
                                type="number"
                                value={form.contractAmount}
                                onChange={(e) => handleChange('contractAmount', e.target.value)}
                                placeholder="e.g. 5000"
                                style={inputStyle}
                                onFocus={(e) => (e.target.style.borderColor = '#00bba7')}
                                onBlur={(e) => (e.target.style.borderColor = '#E5E1DB')}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>Payment terms</label>
                            <select
                                value={form.paymentTerms}
                                onChange={(e) => handleChange('paymentTerms', e.target.value)}
                                style={inputStyle}
                                onFocus={(e) => (e.target.style.borderColor = '#00bba7')}
                                onBlur={(e) => (e.target.style.borderColor = '#E5E1DB')}
                            >
                                <option value="milestone">Milestone payments</option>
                                <option value="final-payment">Final payment</option>
                                <option value="upfront">Upfront</option>
                                <option value="installments">Installments</option>
                            </select>
                        </div>

                        <div>
                            <label style={labelStyle}>Start date</label>
                            <input
                                type="date"
                                value={form.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                style={{ ...inputStyle, colorScheme: 'light' }}
                                onFocus={(e) => (e.target.style.borderColor = '#00bba7')}
                                onBlur={(e) => (e.target.style.borderColor = '#E5E1DB')}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>End date</label>
                            <input
                                type="date"
                                value={form.endDate}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                                style={{ ...inputStyle, colorScheme: 'light' }}
                                onFocus={(e) => (e.target.style.borderColor = '#00bba7')}
                                onBlur={(e) => (e.target.style.borderColor = '#E5E1DB')}
                            />
                        </div>

                        {saveError && (
                            <div
                                className="px-3.5 py-2.5 rounded-xl text-sm"
                                style={{ backgroundColor: '#FBEAEA', color: '#A14B4B', border: '1px solid #F3D6D6' }}
                            >
                                {saveError}
                            </div>
                        )}
                    </div>

                    <div
                        className="px-6 py-4 flex justify-end gap-3 flex-shrink-0"
                        style={{ backgroundColor: '#FBFAF8', borderTop: '1px solid #F0EDE7' }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-medium rounded-xl disabled:opacity-50"
                            style={{ color: '#7A746A', backgroundColor: '#F0EDE7' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-4 py-2 text-sm font-semibold text-white rounded-xl disabled:opacity-60"
                            style={{ backgroundColor: '#00bba7' }}
                        >
                            {isSaving ? 'Saving…' : 'Save changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Milestone row ───────────────────────────────────────────────────────────────

function MilestoneRow({ milestone, index, isCurrent, currency }) {
    const s = milestoneStatusStyle(milestone.status);
    return (
        <div
            className="rounded-xl px-3.5 py-3"
            style={{
                backgroundColor: isCurrent ? '#FFFFFF' : '#FBFAF8',
                border: isCurrent ? '1px solid #B7E9E2' : '1px solid #F0EDE7',
            }}
        >
            <div className="flex items-start justify-between gap-3 mb-1.5">
                <div className="flex items-start gap-2 min-w-0">
                    <span
                        className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold"
                        style={{ backgroundColor: '#F0EDE7', color: '#7A746A' }}
                    >
                        {index + 1}
                    </span>
                    <div className="min-w-0">
                        <div className="text-sm font-medium leading-snug" style={{ color: '#2A2826' }}>
                            {milestone.title || `Milestone ${index + 1}`}
                        </div>
                        {isCurrent && (
                            <span className="text-[11px] font-semibold" style={{ color: '#00897A' }}>
                                Current milestone
                            </span>
                        )}
                    </div>
                </div>
                <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0 whitespace-nowrap"
                    style={{ backgroundColor: s.bg, color: s.text }}
                >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                    {s.label}
                </span>
            </div>

            {milestone.description && (
                <p className="text-xs leading-relaxed mb-2 whitespace-pre-line" style={{ color: '#8A8377', paddingLeft: '28px' }}>
                    {milestone.description}
                </p>
            )}

            <div className="flex items-center gap-3 flex-wrap" style={{ paddingLeft: '28px' }}>
                <span className="text-xs font-semibold" style={{ color: '#B97A2C' }}>
                    {formatCurrency(milestone.amount, currency)}
                </span>
                <span className="inline-flex items-center gap-1 text-xs" style={{ color: '#B5AFA1' }}>
                    <IconCalendar />
                    Due {formatDate(milestone.dueDate)}
                </span>
            </div>
        </div>
    );
}

// ── Main Component ─────────────────────────────────────────────────────────────

const Contracts = () => {
    const [contracts, setContracts] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');

    // action state
    const [actionLoading, setActionLoading] = useState({});
    const [actionError, setActionError] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');

    // expand/collapse state for details (milestones / scope of work)
    const [expanded, setExpanded] = useState({});

    const fetchContracts = async (params = {}) => {
        setIsLoading(true);
        setError('');
        try {
            const { page = 1, limit = 10, status = '' } = params;
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(status && { status }),
            });
            const response = await API.get(`/contracts?${queryParams}`);
            if (response.data.success) {
                setContracts(response.data.data.items);
                setPagination(response.data.data.pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch contracts');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchContracts({ page: currentPage, limit: 10, status: statusFilter });
    }, [currentPage, statusFilter]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getUniqueStatuses = () => {
        return [...new Set(contracts.map((c) => c.status).filter(Boolean))].sort();
    };

    const toggleExpanded = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    // ── Send ──────────────────────────────────────────────────────────
    // ✅ FIXED: Fetch actual status from backend after sending
    const handleSend = async (contract) => {
        setActionLoading((prev) => ({ ...prev, [contract._id]: 'send' }));
        setActionError('');
        try {
            // Step 1: Send the contract
            await API.post(`/contracts/${contract._id}/send`);
            
            // Step 2: Fetch the actual status from backend (not optimistic update)
            const statusResponse = await API.get(`/contracts/${contract._id}/status`);
            if (statusResponse.data.success) {
                const updatedContract = statusResponse.data.data;
                setContracts((prev) =>
                    prev.map((c) => c._id === contract._id ? { ...c, ...updatedContract } : c)
                );
            }
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to send contract');
        } finally {
            setActionLoading((prev) => ({ ...prev, [contract._id]: null }));
        }
    };

    // ── Delete ────────────────────────────────────────────────────────
    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;
        setActionLoading((prev) => ({ ...prev, [deleteTarget._id]: 'delete' }));
        setActionError('');
        try {
            await API.delete(`/contracts/${deleteTarget._id}`);
            setContracts((prev) => prev.filter((c) => c._id !== deleteTarget._id));
            setDeleteTarget(null);
        } catch (err) {
            setActionError(err.response?.data?.message || 'Failed to delete contract');
            setDeleteTarget(null);
        } finally {
            setActionLoading((prev) => ({ ...prev, [deleteTarget?._id]: null }));
        }
    };

    // ── Edit / Save ───────────────────────────────────────────────────
    const handleSaveEdit = async (formData) => {
        if (!editTarget) return;
        setIsSaving(true);
        setSaveError('');
        try {
            const response = await API.put(`/contracts/${editTarget._id}`, {
                projectName: formData.projectName,
                contractAmount: formData.contractAmount ? Number(formData.contractAmount) : undefined,
                paymentTerms: formData.paymentTerms,
                startDate: formData.startDate || undefined,
                endDate: formData.endDate || undefined,
            });
            const updated = response.data?.data || { ...editTarget, ...formData };
            setContracts((prev) =>
                prev.map((c) => c._id === editTarget._id ? { ...c, ...updated } : c)
            );
            setEditTarget(null);
        } catch (err) {
            setSaveError(err.response?.data?.message || 'Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6" style={{ backgroundColor: '#FBFAF8', minHeight: '100vh' }}>

            {/* Modals */}
            {deleteTarget && (
                <DeleteConfirmModal
                    contract={deleteTarget}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeleteTarget(null)}
                    isDeleting={actionLoading[deleteTarget._id] === 'delete'}
                />
            )}
            {editTarget && (
                <EditContractModal
                    contract={editTarget}
                    onClose={() => { setEditTarget(null); setSaveError(''); }}
                    onSave={handleSaveEdit}
                    isSaving={isSaving}
                    saveError={saveError}
                />
            )}

            {/* Heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-semibold" style={{ color: '#2A2826' }}>Contracts</h1>
                <p className="mt-1.5" style={{ color: '#8A8377' }}>Everything you've put in writing, in one place</p>
            </div>

            {/* Status filter */}
            <div className="mb-7 flex gap-3 items-center flex-wrap">
                <span className="text-sm font-medium" style={{ color: '#8A8377' }}>Filter by status</span>
                <button
                    type="button"
                    onClick={() => { setStatusFilter(''); setCurrentPage(1); }}
                    className="px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors"
                    style={statusFilter === ''
                        ? { backgroundColor: '#2A2826', color: '#FFFFFF' }
                        : { backgroundColor: '#F0EDE7', color: '#8A8377' }}
                >
                    All
                </button>
                {getUniqueStatuses().map((status) => {
                    const s = statusStyle(status);
                    return (
                        <button
                            key={status}
                            type="button"
                            onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium capitalize transition-colors"
                            style={statusFilter === status
                                ? { backgroundColor: '#2A2826', color: '#FFFFFF' }
                                : { backgroundColor: '#F0EDE7', color: '#8A8377' }}
                        >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.dot }} />
                            {status}
                        </button>
                    );
                })}
            </div>

            {/* Fetch error */}
            {error && (
                <div className="px-4 py-3 rounded-xl mb-6 text-sm"
                    style={{ backgroundColor: '#FBEAEA', color: '#A14B4B', border: '1px solid #F3D6D6' }}>
                    {error}
                </div>
            )}

            {/* Action error */}
            {actionError && (
                <div className="px-4 py-3 rounded-xl mb-4 text-sm flex items-center justify-between"
                    style={{ backgroundColor: '#FBEAEA', color: '#A14B4B', border: '1px solid #F3D6D6' }}>
                    <span>{actionError}</span>
                    <button
                        type="button"
                        onClick={() => setActionError('')}
                        className="ml-3 flex-shrink-0"
                        style={{ color: '#A14B4B' }}
                        aria-label="Dismiss"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Loading */}
            {isLoading && contracts.length === 0 && (
                <div className="text-center py-20" style={{ color: '#B5AFA1' }}>
                    Gathering the contracts…
                </div>
            )}

            {/* Results summary */}
            {pagination && !isLoading && contracts.length > 0 && (
                <div className="mb-5 text-sm" style={{ color: '#8A8377' }}>
                    <span className="font-semibold" style={{ color: '#2A2826' }}>{pagination.total}</span>{' '}
                    {pagination.total === 1 ? 'contract' : 'contracts'}{statusFilter ? ' match' : ' total'}
                </div>
            )}

            {/* Cards */}
            {!isLoading && contracts.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                    {contracts.map((contract) => {
                        const s = statusStyle(contract.status);
                        const avatarColor = avatarColorForName(contract.clientName);
                        const busy = actionLoading[contract._id];
                        const isOpen = !!expanded[contract._id];
                        const milestones = contract.milestones || [];
                        const hasDetails = milestones.length > 0 || !!contract.scopeOfWork;

                        return (
                            <div
                                key={contract._id}
                                className="relative rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #EDE9E3',
                                    boxShadow: '0 1px 2px rgba(42,40,38,0.03)',
                                }}
                            >
                                {/* Card body */}
                                <div className="pl-6 pr-5 py-5">

                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="min-w-0">
                                            <div className="font-semibold text-base truncate" style={{ color: '#2A2826' }}>
                                                {contract.projectName || 'Untitled project'}
                                            </div>
                                            <div className="text-xs mt-0.5" style={{ color: '#C9C3B8' }}>
                                                Created {formatDate(contract.createdAt)}
                                            </div>
                                        </div>
                                        <span
                                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize flex-shrink-0"
                                            style={{ backgroundColor: s.bg, color: s.text }}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
                                            {contract.status || 'unknown'}
                                        </span>
                                    </div>

                                    {/* Client */}
                                    <div
                                        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 mb-4"
                                        style={{ backgroundColor: '#FBFAF8' }}
                                    >
                                        <div
                                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0"
                                            style={{ backgroundColor: avatarColor }}
                                        >
                                            {initialsForName(contract.clientName)}
                                        </div>
                                        <div className="text-sm min-w-0">
                                            <div className="font-medium truncate" style={{ color: '#2A2826' }}>
                                                {contract.clientName || 'No client name'}
                                            </div>
                                            {contract.clientEmail && (
                                                <a
                                                    href={`mailto:${contract.clientEmail}`}
                                                    className="truncate block transition-colors"
                                                    style={{ color: '#B5AFA1' }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.color = '#00bba7')}
                                                    onMouseLeave={(e) => (e.currentTarget.style.color = '#B5AFA1')}
                                                >
                                                    {contract.clientEmail}
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* Amount + payment terms + revisions */}
                                    <div className="flex items-center gap-2 flex-wrap mb-3.5">
                                        <span
                                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                                            style={{ backgroundColor: '#FBF0E2', color: '#B97A2C' }}
                                        >
                                            {formatCurrency(contract.contractAmount, contract.currency)}
                                        </span>
                                        {!!contract.advanceAmount && (
                                            <span
                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                                                style={{ backgroundColor: '#F0EDE7', color: '#7A746A' }}
                                            >
                                                Advance: {formatCurrency(contract.advanceAmount, contract.currency)}
                                            </span>
                                        )}
                                        <span
                                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                                            style={{ backgroundColor: '#F0EDE7', color: '#7A746A' }}
                                        >
                                            {PAYMENT_TERMS_LABELS[contract.paymentTerms] || contract.paymentTerms || 'No payment terms'}
                                        </span>
                                        {contract.revisions !== undefined && contract.revisions !== null && (
                                            <span
                                                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                                                style={{ backgroundColor: '#F0EDE7', color: '#7A746A' }}
                                            >
                                                {contract.revisions} {contract.revisions === 1 ? 'revision' : 'revisions'}
                                            </span>
                                        )}
                                    </div>

                                    {/* Timeline */}
                                    <div
                                        className="flex items-center gap-2 text-sm pt-3"
                                        style={{ borderTop: '1px solid #F5F3EF', color: '#7A746A' }}
                                    >
                                        <IconCalendar />
                                        <span>{formatDate(contract.startDate)}</span>
                                        <span style={{ color: '#C9C3B8' }}>→</span>
                                        <span>{formatDate(contract.endDate)}</span>
                                    </div>

                                    {/* Expand toggle for scope of work / milestones */}
                                    {hasDetails && (
                                        <button
                                            type="button"
                                            onClick={() => toggleExpanded(contract._id)}
                                            className="mt-3.5 w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-medium transition-colors"
                                            style={{ backgroundColor: '#FBFAF8', color: '#5C5750' }}
                                        >
                                            <span className="inline-flex items-center gap-1.5">
                                                <IconFlag />
                                                {milestones.length > 0
                                                    ? `${milestones.length} ${milestones.length === 1 ? 'milestone' : 'milestones'}`
                                                    : 'Scope of work'}
                                            </span>
                                            <IconChevron open={isOpen} />
                                        </button>
                                    )}

                                    {/* Expanded details */}
                                    {hasDetails && isOpen && (
                                        <div className="mt-3 space-y-3">
                                            {contract.scopeOfWork && (
                                                <div
                                                    className="rounded-xl px-3.5 py-3"
                                                    style={{ backgroundColor: '#FBFAF8', border: '1px solid #F0EDE7' }}
                                                >
                                                    <div className="text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: '#B5AFA1', letterSpacing: '0.04em' }}>
                                                        Scope of work
                                                    </div>
                                                    <p className="text-sm leading-relaxed" style={{ color: '#5C5750' }}>
                                                        {contract.scopeOfWork}
                                                    </p>
                                                </div>
                                            )}

                                            {milestones.length > 0 && (
                                                <div className="space-y-2">
                                                    {milestones
                                                        .slice()
                                                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                                                        .map((milestone, idx) => (
                                                            <MilestoneRow
                                                                key={milestone._id || idx}
                                                                milestone={milestone}
                                                                index={idx}
                                                                isCurrent={idx === contract.currentMilestoneIndex}
                                                                currency={contract.currency}
                                                            />
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* ── Action bar ── */}
                                <div
                                    className="px-5 py-3 flex items-center justify-end gap-2"
                                    style={{ backgroundColor: '#FBFAF8', borderTop: '1px solid #F0EDE7' }}
                                >
                                    {/* 
                                    ✅ SEND BUTTON FIX
                                    - Only show when status === 'draft'
                                    - Button disappears immediately after successful send
                                    - Shows "Sending..." during the request
                                    - Gets latest status from backend
                                    */}
                                    {contract.status === 'draft' && (
                                        <button
                                            type="button"
                                            disabled={!!busy}
                                            onClick={() => handleSend(contract)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-opacity disabled:opacity-50"
                                            style={{ backgroundColor: '#00bba7' }}
                                        >
                                            <IconSend />
                                            {busy === 'send' ? 'Sending…' : 'Send to client'}
                                        </button>
                                    )}
                                     {contract.status !== 'draft' && (
                                        <button
                                            type="button"
                                            disabled={true}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-opacity disabled:opacity-50"
                                            style={{ backgroundColor: '#00bba7' }}
                                        >
                                            Already Sent
                                        </button>
                                    )}

                                    {/* Edit */}
                                    <button
                                        type="button"
                                        disabled={!!busy}
                                        onClick={() => { setSaveError(''); setEditTarget(contract); }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
                                        style={{ backgroundColor: '#F0EDE7', color: '#7A746A' }}
                                    >
                                        <IconEdit />
                                        Edit
                                    </button>

                                    {/* Delete */}
                                    <button
                                        type="button"
                                        disabled={!!busy}
                                        onClick={() => setDeleteTarget(contract)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors disabled:opacity-50"
                                        style={{ backgroundColor: '#FBEAEA', color: '#A14B4B' }}
                                    >
                                        <IconTrash />
                                        {busy === 'delete' ? 'Deleting…' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && contracts.length === 0 && (
                <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: '#FFFFFF', border: '1px dashed #EDE9E3' }}>
                    <div
                        className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: '#F0EDE7' }}
                    >
                        <IconDoc />
                    </div>
                    <h3 className="text-lg font-medium mb-1.5" style={{ color: '#2A2826' }}>
                        {statusFilter ? 'Nothing matches yet' : 'No contracts yet'}
                    </h3>
                    <p style={{ color: '#8A8377' }}>
                        {statusFilter
                            ? 'Try clearing the filter to see everything'
                            : 'Contracts you create from submissions will show up here'}
                    </p>
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && !isLoading && (
                <div className="flex justify-center items-center gap-1.5">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="px-4 py-2 text-sm rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ color: '#7A746A', backgroundColor: '#F0EDE7' }}
                    >
                        Previous
                    </button>

                    <div className="flex gap-1">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className="w-9 h-9 text-sm rounded-full transition-colors font-medium"
                                style={page === currentPage
                                    ? { backgroundColor: '#00bba7', color: '#FFFFFF' }
                                    : { color: '#8A8377', backgroundColor: 'transparent' }}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 text-sm rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ color: '#7A746A', backgroundColor: '#F0EDE7' }}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Contracts;