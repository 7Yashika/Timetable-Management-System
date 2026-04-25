import { useState } from "react";
import { createPortal } from "react-dom";

export default function EditSlotModal({ day, time, batch, slots = [], onClose, refresh }) {
  const [form, setForm] = useState({ subject: "", faculty: "", room: "", subBatch: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleAdd = async () => {
    if (!form.subject.trim() || !form.faculty.trim()) {
      alert("Subject and Faculty are required");
      return;
    }

    const newSlot = {
      subject: form.subject.trim(),
      faculty: form.faculty.trim(),
      room_id: form.room?.trim() || null,
      subBatch: form.subBatch?.trim() || null,
      day,
      time,
      batch,
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlot),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
          (data.faculty_conflict && "Faculty already busy") ||
          (data.room_conflict && "Room already occupied") ||
          (data.lab_conflict && "Lab already occupied") ||
          "Failed to add slot"
        );
        return;
      }

      setForm({ subject: "", faculty: "", room: "", subBatch: "" });
      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/slots/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Delete failed");
        return;
      }
      refresh();
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  };

  // Rendered via portal — escapes parent overflow/z-index/transform stacking contexts
  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(15,23,42,.55)",
        backdropFilter: "blur(4px)",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes esSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .es-box { animation: esSlideUp .2s ease; }
        .es-input { width:100%; border:1px solid #e2e8f0; border-radius:12px; padding:9px 13px; font-size:13px; font-family:'DM Sans',sans-serif; color:#1e293b; background:#f8fafc; outline:none; transition:all .15s; box-sizing:border-box; }
        .es-input:focus { border-color:#fbbf24; box-shadow:0 0 0 3px rgba(251,191,36,.15); background:#fff; }
        .es-input::placeholder { color:#cbd5e1; }
        .es-remove-btn { font-size:11px; font-weight:600; color:#f43f5e; background:transparent; border:none; cursor:pointer; padding:3px 8px; border-radius:8px; transition:all .15s; white-space:nowrap; }
        .es-remove-btn:hover { background:#fff1f2; }
        .es-btn-primary { flex:1; background:#1e293b; color:#fff; border:none; border-radius:12px; padding:11px 20px; font-size:13px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:background .15s; }
        .es-btn-primary:hover:not(:disabled) { background:#334155; }
        .es-btn-primary:disabled { opacity:.6; cursor:not-allowed; }
        .es-btn-secondary { padding:11px 20px; border:1px solid #e2e8f0; border-radius:12px; background:#fff; color:#475569; font-size:13px; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; transition:all .15s; }
        .es-btn-secondary:hover { border-color:#cbd5e1; color:#1e293b; }
        .es-close-btn { width:32px; height:32px; border-radius:8px; border:none; background:transparent; color:#94a3b8; cursor:pointer; font-size:22px; display:flex; align-items:center; justify-content:center; transition:all .15s; line-height:1; flex-shrink:0; }
        .es-close-btn:hover { background:#334155; color:#fff; }
        .es-label { display:block; font-size:10px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.08em; margin-bottom:5px; font-family:'DM Mono',monospace; }
        .es-section-label { font-size:10px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:.1em; margin-bottom:10px; font-family:'DM Mono',monospace; }
      `}</style>

      {/* Modal box */}
      <div
        className="es-box"
        style={{
          background: "#fff",
          width: 460,
          maxWidth: "calc(100vw - 32px)",
          borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,.3)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ background: "#1e293b", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 4 }}>
              Edit Slot
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
              {day} · {time}
              <span style={{ fontSize: 11, fontWeight: 600, background: "#fbbf24", color: "#0f172a", padding: "2px 8px", borderRadius: 20 }}>
                {batch}
              </span>
            </div>
          </div>
          <button className="es-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>

          <div className="es-section-label">Existing Entries</div>

          <div style={{ maxHeight: 160, overflowY: "auto", marginBottom: 2 }}>
            {slots.length === 0 ? (
              <p style={{ fontSize: 12, color: "#94a3b8" }}>No slots assigned yet.</p>
            ) : (
              slots.map((s) => (
                <div
                  key={s._id}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#f8fafc", border: "1px solid #e2e8f0",
                    borderRadius: 12, padding: "8px 12px", marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 11, color: "#334155" }}>
                    <strong>{s.subject}</strong>
                    {" · "}{s.subBatch || "ALL"}
                    {" · "}{s.faculty}
                    {" · "}{s.room_number || s.lab_number || "—"}
                  </span>
                  <button className="es-remove-btn" onClick={() => handleDelete(s._id)}>Remove</button>
                </div>
              ))
            )}
          </div>

          <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />

          <div className="es-section-label">Add New Entry</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ gridColumn: "span 2" }}>
              <label className="es-label">Subject</label>
              <input className="es-input" placeholder="e.g. Data Structures" value={form.subject} onChange={(e) => handleChange("subject", e.target.value)} />
            </div>
            <div>
              <label className="es-label">Faculty</label>
              <input className="es-input" placeholder="e.g. Dr. Sharma" value={form.faculty} onChange={(e) => handleChange("faculty", e.target.value)} />
            </div>
            <div>
              <label className="es-label">Sub-Batch</label>
              <input className="es-input" placeholder="A1 / A2 (optional)" value={form.subBatch} onChange={(e) => handleChange("subBatch", e.target.value)} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label className="es-label">Room / Lab</label>
              <input className="es-input" placeholder="e.g. 213 / LAB-A" value={form.room} onChange={(e) => handleChange("room", e.target.value)} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button className="es-btn-primary" onClick={handleAdd} disabled={loading}>
              {loading ? "Adding…" : "Add Slot"}
            </button>
            <button className="es-btn-secondary" onClick={onClose}>Cancel</button>
          </div>

        </div>
      </div>
    </div>,
    document.body
  );
}
// import { useState } from "react";

// export default function EditSlotModal({
//   day,
//   time,
//   batch,
//   slots = [],
//   onClose,
//   refresh
// }) {
//   const [form, setForm] = useState({
//     subject: "",
//     faculty: "",
//     room: "",
//     subBatch: ""
//   });

//   const [loading, setLoading] = useState(false);

//   // 🔹 Handle input change
//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   // 🔹 Add Slot
//   const handleAdd = async () => {
//     if (!form.subject.trim() || !form.faculty.trim()) {
//       alert("Subject and Faculty are required");
//       return;
//     }

//     const newSlot = {
//       subject: form.subject.trim(),
//       faculty: form.faculty.trim(),
//       room_id: form.room?.trim() || null,   // backend expects this
//       subBatch: form.subBatch?.trim() || null,
//       day,
//       time,
//       batch
//     };

//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/slots", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(newSlot)
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(
//           data.error ||
//           (data.faculty_conflict && "Faculty already busy") ||
//           (data.room_conflict && "Room already occupied") ||
//           (data.lab_conflict && "Lab already occupied") ||
//           "Failed to add slot"
//         );
//         return;
//       }

//       // ✅ reset form + refresh UI
//       setForm({
//         subject: "",
//         faculty: "",
//         room: "",
//         subBatch: ""
//       });

//       refresh();
//       onClose();

//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Delete Slot
//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/slots/${id}`,
//         { method: "DELETE" }
//       );

//       if (!res.ok) {
//         const data = await res.json();
//         alert(data.error || "Delete failed");
//         return;
//       }

//       refresh();

//     } catch (err) {
//       console.error(err);
//       alert("Delete error");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
//       <div className="bg-white p-4 w-[420px] rounded shadow-lg">

//         {/* Header */}
//         <h2 className="font-bold mb-3 text-lg">
//           {day} {time} ({batch})
//         </h2>

//         {/* Existing Slots */}
//         <div className="mb-3 max-h-[160px] overflow-y-auto">
//           {slots.length === 0 ? (
//             <p className="text-gray-500 text-sm">No slots</p>
//           ) : (
//             slots.map((s) => (
//               <div
//                 key={s._id}
//                 className="flex justify-between items-center border p-1 mb-1 text-xs rounded"
//               >
//                 <span>
//                   {s.subject} | {s.subBatch || "-"} | {s.faculty} |{" "}
//                   {s.room_number || s.lab_number || "-"}
//                 </span>

//                 <button
//                   className="text-red-500 hover:underline"
//                   onClick={() => handleDelete(s._id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Form */}
//         <div className="space-y-2">
//           <input
//             placeholder="Subject"
//             value={form.subject}
//             onChange={(e) => handleChange("subject", e.target.value)}
//             className="border p-1 w-full text-sm"
//           />

//           <input
//             placeholder="Sub Batch (optional)"
//             value={form.subBatch}
//             onChange={(e) => handleChange("subBatch", e.target.value)}
//             className="border p-1 w-full text-sm"
//           />

//           <input
//             placeholder="Faculty"
//             value={form.faculty}
//             onChange={(e) => handleChange("faculty", e.target.value)}
//             className="border p-1 w-full text-sm"
//           />

//           <input
//             placeholder="Room Number / Lab"
//             value={form.room}
//             onChange={(e) => handleChange("room", e.target.value)}
//             className="border p-1 w-full text-sm"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-2 mt-3">
//           <button
//             onClick={handleAdd}
//             disabled={loading}
//             className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
//           >
//             {loading ? "Adding..." : "Add Slot"}
//           </button>

//           <button
//             onClick={onClose}
//             className="text-sm px-2 py-1 border rounded"
//           >
//             Close
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }



// import { useState } from "react";

// export default function EditSlotModal({ day, time, batch, slots = [], onClose, refresh }) {
//   const [form, setForm] = useState({
//     subject: "",
//     faculty: "",
//     room: "",       // 🔥 renamed for clarity
//     subBatch: ""
//   });

//   const [loading, setLoading] = useState(false);

//   // 🔹 Add Slot
//   const handleAdd = async () => {
//     if (!form.subject || !form.faculty) {
//       alert("Subject and Faculty are required");
//       return;
//     }

//     const newSlot = {
//       subject: form.subject.trim(),
//       faculty: form.faculty.trim(),
//       room_id: form.room || null,   // backend still expects room_id field
//       subBatch: form.subBatch || null,
//       day,
//       time,
//       batch
//     };

//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/slots", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(newSlot)
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(
//           data.error ||
//           (data.faculty_conflict && "Faculty already busy") ||
//           (data.room_conflict && "Room already occupied") ||
//           (data.lab_conflict && "Lab already occupied") ||
//           "Error adding slot"
//         );
//         return;
//       }

//       refresh();
//       onClose();   // close after success

//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Delete Slot
//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/slots/${id}`, {
//         method: "DELETE"
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         alert(data.error || "Delete failed");
//         return;
//       }

//       refresh();

//     } catch (err) {
//       console.error(err);
//       alert("Delete error");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
//       <div className="bg-white p-4 w-[420px] rounded shadow-lg">

//         {/* Header */}
//         <h2 className="font-bold mb-3 text-lg">
//           {day} {time} ({batch})
//         </h2>

//         {/* Existing Slots */}
//         <div className="mb-3 max-h-[160px] overflow-y-auto">
//           {slots.length === 0 ? (
//             <div className="text-gray-500 text-sm">No slots</div>
//           ) : (
//             slots.map((s) => (
//               <div
//                 key={s._id}
//                 className="flex justify-between items-center border p-1 mb-1 text-xs rounded"
//               >
//                 <span>
//                   {s.subject} | {s.subBatch || "-"} | {s.faculty} |{" "}
//                   {s.room_number || s.lab_number || "-"}
//                 </span>

//                 <button
//                   className="text-red-500 hover:underline"
//                   onClick={() => handleDelete(s._id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Form */}
//         <div className="space-y-2">
//           <input
//             placeholder="Subject"
//             value={form.subject}
//             onChange={(e) => setForm({ ...form, subject: e.target.value })}
//             className="border p-1 w-full text-sm"
//           />

//           <input
//             placeholder="Sub Batch (optional)"
//             value={form.subBatch}
//             onChange={(e) => setForm({ ...form, subBatch: e.target.value })}
//             className="border p-1 w-full text-sm"
//           />

//           <input
//             placeholder="Faculty"
//             value={form.faculty}
//             onChange={(e) => setForm({ ...form, faculty: e.target.value })}
//             className="border p-1 w-full text-sm"
//           />

//           <input
//             placeholder="Room Number / Lab"
//             value={form.room}
//             onChange={(e) => setForm({ ...form, room: e.target.value })}
//             className="border p-1 w-full text-sm"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex gap-2 mt-3">
//           <button
//             onClick={handleAdd}
//             disabled={loading}
//             className="bg-blue-500 text-white px-3 py-1 text-sm rounded"
//           >
//             {loading ? "Adding..." : "Add Slot"}
//           </button>

//           <button
//             onClick={onClose}
//             className="text-sm px-2 py-1 border rounded"
//           >
//             Close
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// import { useState } from "react";

// export default function EditSlotModal({ day, time, batch, slots, onClose, refresh }) {
//   const [form, setForm] = useState({
//     subject: "",
//     faculty: "",
//     room_id: "",
//     subBatch: ""
//   });

//   const [loading, setLoading] = useState(false);

//   const handleAdd = async () => {
//     if (!form.subject || !form.faculty) {
//       alert("Subject and Faculty are required");
//       return;
//     }

//     const newSlot = {
//       subject: form.subject,
//       faculty: form.faculty,
//       room_id: form.room_id || null,
//       subBatch: form.subBatch || null,
//       day,
//       time,
//       batch
//     };

//     console.log("Sending:", newSlot);

//     try {
//       setLoading(true);

//       const res = await fetch("http://localhost:5000/api/slots", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(newSlot)
//       });

//       const data = await res.json();
//       console.log("Response:", data);

//       if (!res.ok) {
//         // 🔥 show exact backend reason
//         alert(
//           data.error ||
//           (data.faculty_conflict && "Faculty already busy") ||
//           (data.room_conflict && "Room already occupied") ||
//           (data.lab_conflict && "Lab already occupied") ||
//           "Error adding slot"
//         );
//         return;
//       }

//       // ✅ success flow
//       refresh();
//       onClose();   // 🔥 close modal after success

//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/slots/${id}`, {
//         method: "DELETE"
//       });

//       if (!res.ok) {
//         const data = await res.json();
//         alert(data.error || "Delete failed");
//         return;
//       }

//       refresh();

//     } catch (err) {
//       console.error(err);
//       alert("Delete error");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
//       <div className="bg-white p-4 w-[400px] rounded shadow">

//         <h2 className="font-bold mb-2">
//           {day} {time} ({batch})
//         </h2>

//         {/* Existing Slots */}
//         <div className="mb-3 max-h-[150px] overflow-y-auto">
//           {slots.length === 0 && (
//             <div className="text-gray-500 text-sm">No slots</div>
//           )}

//           {slots.map((s) => (
//             <div key={s._id} className="flex justify-between border p-1 mb-1 text-xs">
//               <span>
//                 {s.subject} | {s.subBatch || "-"} | {s.faculty} | {s.room_id || s.lab_id}
//               </span>
//               <button
//                 className="text-red-500"
//                 onClick={() => handleDelete(s._id)}
//               >
//                 Delete
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Form */}
//         {["subject", "subBatch", "faculty", "room_id"].map((field) => (
//           <input
//             key={field}
//             placeholder={field}
//             value={form[field]}
//             onChange={(e) =>
//               setForm({ ...form, [field]: e.target.value })
//             }
//             className="border p-1 w-full mb-2 text-sm"
//           />
//         ))}

//         {/* Buttons */}
//         <div className="flex gap-2">
//           <button
//             onClick={handleAdd}
//             disabled={loading}
//             className="bg-blue-500 text-white px-3 py-1 text-sm"
//           >
//             {loading ? "Adding..." : "Add Slot"}
//           </button>

//           <button onClick={onClose} className="text-sm">
//             Close
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }

// import { useState } from "react";

// export default function EditSlotModal({ day, time, batch, slots, onClose, refresh }) {
//   const [form, setForm] = useState({
//     subject: "",
//     faculty: "",
//     room_id: "",
//     subBatch: ""
//   });

//   const handleAdd = async () => {
//     if (!form.subject || !form.faculty) {
//       alert("Subject and Faculty are required");
//       return;
//     }

//     const newSlot = {
//       ...form,
//       day,
//       time,
//       batch
//     };

//     console.log("Sending: ",newSlot); 
//     try {
//       const res = await fetch("http://localhost:5000/api/slots", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(newSlot)
//       });

//       const data = await res.json();
//       console.log("Response: ",data);

//       if (!res.ok) {
//         alert(data.error || "Error adding slot");
//         return;
//       }

//       alert("Slot add successfully");
//       refresh();
//       setForm({ subject: "", faculty: "", room_id: "", subBatch: "" });

//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       await fetch(`http://localhost:5000/api/slots/${id}`, {
//         method: "DELETE"
//       });

//       refresh();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
//       <div className="bg-white p-4 w-[400px] rounded">
//         <h2 className="font-bold mb-2">
//           {day} {time} ({batch})
//         </h2>

//         {/* Existing Slots */}
//         <div className="mb-2">
//           {slots.map((s) => (
//             <div key={s._id} className="flex justify-between border p-1 mb-1">
//               <span>
//                 {s.subject} | {s.subBatch || "-"} | {s.faculty} | {s.room_id || s.lab_id}
//               </span>
//               <button onClick={() => handleDelete(s._id)}>Delete</button>
//             </div>
//           ))}
//         </div>

//         {/* Form */}
//         {["subject", "subBatch", "faculty", "room_id"].map((field) => (
//           <input
//             key={field}
//             placeholder={field}
//             value={form[field] || ""}
//             onChange={(e) =>
//               setForm({ ...form, [field]: e.target.value })
//             }
//             className="border p-1 w-full mb-1"
//           />
//         ))}

//         <button
//           onClick={handleAdd}
//           className="bg-blue-500 text-white px-2 py-1"
//         >
//           Add Slot
//         </button>

//         <button onClick={onClose} className="ml-2">
//           Close
//         </button>
//       </div>
//     </div>
//   );
// }
// // import { useState } from "react";
// // import { useStore } from "../store/useStore";

// // export default function EditSlotModal({ day, time, batch, slots, onClose }) {
// //   const { addSlot, updateSlot, deleteSlot, checkConflict } = useStore();

// //   const [form, setForm] = useState({
// //     id: "",
// //     subject: "",
// //     subBatch: "",
// //     faculty: "",
// //     room: "",
// //   });

// //   const handleAdd = () => {
// //     const newSlot = {
// //       ...form,
// //       id: Date.now().toString(),
// //       day,
// //       time,
// //       batch,
// //     };

// //     const { facultyConflict, roomConflict } = checkConflict(newSlot);

// //     if (facultyConflict) return alert("Faculty conflict");
// //     if (roomConflict) return alert("Room conflict");

// //     addSlot(newSlot);
// //     setForm({ subject: "", subBatch: "", faculty: "", room: "" });
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
// //       <div className="bg-white p-4 w-[400px] rounded">
// //         <h2 className="font-bold mb-2">
// //           {day} {time} ({batch})
// //         </h2>

// //         <div className="mb-2">
// //           {slots.map((s) => (
// //             <div key={s.id} className="flex justify-between border p-1 mb-1">
// //               <span>
// //                 {s.subject} | {s.subBatch} | {s.faculty} | {s.room}
// //               </span>
// //               <button onClick={() => deleteSlot(s.id)}>Delete</button>
// //             </div>
// //           ))}
// //         </div>

// //         {["subject", "subBatch", "faculty", "room"].map((field) => (
// //           <input
// //             key={field}
// //             placeholder={field}
// //             value={form[field] || ""}
// //             onChange={(e) =>
// //               setForm({ ...form, [field]: e.target.value })
// //             }
// //             className="border p-1 w-full mb-1"
// //           />
// //         ))}

// //         <button onClick={handleAdd} className="bg-blue-500 text-white px-2 py-1">
// //           Add Slot
// //         </button>

// //         <button onClick={onClose} className="ml-2">
// //           Close
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }
