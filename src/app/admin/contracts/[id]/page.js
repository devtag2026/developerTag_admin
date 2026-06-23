"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import API from "@/config/ApiConfig"; // adjust path if needed

export default function ContractActionPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const action = searchParams.get("action"); // "accept" or "reject"

  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id || !action) return;

    const validActions = ["accept", "reject"];
    if (!validActions.includes(action)) {
      setStatus("error");
      setMessage("Invalid action. Expected 'accept' or 'reject'.");
      return;
    }

    handleContractAction();
  }, [id, action]);

  const handleContractAction = async () => {
    setStatus("loading");
    try {
      const endpoint =
        action === "accept"
          ? `/api/v1/contracts/${id}/accept`
          : `/api/v1/contracts/${id}/reject`;

      const response = await API.post(endpoint);

      setStatus("success");
      setMessage(
        response.data?.message ||
          `Contract ${action === "accept" ? "accepted" : "rejected"} successfully.`
      );
    } catch (error) {
      setStatus("error");
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      setMessage(errMsg);
    }
  };

  const isAccept = action === "accept";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9fafb",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: "24px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          padding: "48px 40px",
          maxWidth: "460px",
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px",
          }}
        >
          {status === "loading" && (
            <svg
              style={{ width: "36px", height: "36px", color: "#6366f1", animation: "spin 1s linear infinite" }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40" strokeDashoffset="10" strokeLinecap="round" />
            </svg>
          )}
          {status === "success" && (
            <svg
              style={{ width: "36px", height: "36px", color: isAccept ? "#16a34a" : "#dc2626" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {status === "error" && (
            <svg
              style={{ width: "36px", height: "36px", color: "#dc2626" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {status === "idle" && (
            <svg
              style={{ width: "36px", height: "36px", color: "#6b7280" }}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: "#111827",
            margin: "0",
            lineHeight: "1.3",
          }}
        >
          {status === "loading" && "Processing your request…"}
          {status === "success" && `Contract ${isAccept ? "Accepted" : "Rejected"}`}
          {status === "error" && "Something went wrong"}
          {status === "idle" && "Contract Action"}
        </h1>

        {/* Subtitle / message */}
        <p
          style={{
            fontSize: "15px",
            color: "#6b7280",
            margin: "0",
            lineHeight: "1.6",
            maxWidth: "340px",
          }}
        >
          {status === "loading" && `Please wait while we ${action} this contract.`}
          {(status === "success" || status === "error") && message}
          {status === "idle" && "Preparing action…"}
        </p>

        {/* Contract ID badge */}
        {id && (
          <div
            style={{
              marginTop: "8px",
              backgroundColor: "#f3f4f6",
              borderRadius: "8px",
              padding: "10px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: "600",
                color: "#9ca3af",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Contract ID
            </span>
            <span
              style={{
                fontSize: "12px",
                color: "#374151",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {id}
            </span>
          </div>
        )}

        {/* Retry button on error */}
        {status === "error" && (
          <button
            style={{
              marginTop: "8px",
              padding: "10px 28px",
              backgroundColor: "#6366f1",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={handleContractAction}
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}