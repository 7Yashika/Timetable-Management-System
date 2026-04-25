import { useEffect, useState } from "react";
import TimetableGrid from "../components/TimetableGrid";

export default function MasterPage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch batches
  const fetchBatches = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/batches");
      if (!res.ok) throw new Error("Failed to fetch batches");

      const data = await res.json();
      const batchNames = data.map((b) => b.name?.trim()).filter(Boolean);

      setBatches(batchNames);

      if (batchNames.length > 0) {
        setSelectedBatch((prev) => prev || batchNames[0]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load batches");
    }
  };

  // 🔹 Fetch slots
  const fetchSlots = async (batch) => {
    if (!batch) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`http://localhost:5000/api/slots?batch=${batch}`);

      if (!res.ok) {
        const msg = await res.json();
        throw new Error(msg.error || "Failed to fetch slots");
      }

      const data = await res.json();
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setSlots([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Initial load
  useEffect(() => { fetchBatches(); }, []);

  // 🔹 Load slots when batch changes
  useEffect(() => {
    if (selectedBatch) fetchSlots(selectedBatch);
  }, [selectedBatch]);

  return (
    <div style={{ padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 }}>
            Master Timetable
          </h2>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            Manage all class slots across batches
          </p>
        </div>

        {/* ── Batch Selector ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: ".08em" }}>
            Batch
          </span>
          <div style={{ position: "relative" }}>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              style={{
                appearance: "none",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "9px 36px 9px 14px",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                color: "#1e293b",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,.06)",
                outline: "none",
              }}
            >
              {batches.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <span style={{
              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
              color: "#94a3b8", pointerEvents: "none", fontSize: 12,
            }}>▾</span>
          </div>
        </div>
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13, padding: "12px 0" }}>
          <div style={{
            width: 16, height: 16,
            border: "2px solid #fbbf24",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
          }} />
          Loading schedule…
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* ── Error State ── */}
      {error && (
        <div style={{
          background: "#fff1f2", border: "1px solid #fecdd3",
          color: "#be123c", fontSize: 13, padding: "10px 16px",
          borderRadius: 12, marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {/* ── Timetable Grid ── */}
      {!loading && selectedBatch && (
        <TimetableGrid
          batch={selectedBatch}
          slots={slots}
          refresh={() => fetchSlots(selectedBatch)}
        />
      )}
    </div>
  );
}
// import { useEffect, useState } from "react";
// import TimetableGrid from "../components/TimetableGrid";

// export default function MasterPage() {
//   const [batches, setBatches] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [slots, setSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 🔹 Fetch batches
//   const fetchBatches = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/batches");
//       if (!res.ok) throw new Error("Failed to fetch batches");

//       const data = await res.json();
//       const batchNames = data.map((b) => b.name?.trim()).filter(Boolean);

//       setBatches(batchNames);

//       // auto-select first batch
//       if (batchNames.length > 0) {
//         setSelectedBatch((prev) => prev || batchNames[0]);
//       }

//     } catch (err) {
//       console.error(err);
//       setError("Failed to load batches");
//     }
//   };

//   // 🔹 Fetch slots
//   const fetchSlots = async (batch) => {
//     if (!batch) return;

//     try {
//       setLoading(true);
//       setError("");

//       // const res = await fetch(
//       //   `http://localhost:5000/api/batches/${batch}/schedule`
//       // );
//       // UPDATED
//       const res = await fetch(
//         `http://localhost:5000/api/slots?batch=${batch}`
//       );

//       if (!res.ok) {
//         const msg = await res.json();
//         throw new Error(msg.error || "Failed to fetch slots");
//       }

//       const data = await res.json();

//       // 🔥 IMPORTANT: ensure array
//       setSlots(Array.isArray(data) ? data : []);

//     } catch (err) {
//       console.error(err);
//       setSlots([]);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Initial load
//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   // 🔹 Load slots when batch changes
//   useEffect(() => {
//     if (selectedBatch) {
//       fetchSlots(selectedBatch);
//     }
//   }, [selectedBatch]);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Master Timetable</h2>

//       {/* Batch Selector */}
//       <div className="mb-4">
//         <label className="mr-2 font-medium">Select Batch:</label>

//         <select
//           value={selectedBatch}
//           onChange={(e) => setSelectedBatch(e.target.value)}
//           className="border p-1 rounded"
//         >
//           {batches.map((b) => (
//             <option key={b} value={b}>
//               {b}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Status */}
//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Timetable */}
//       {!loading && selectedBatch && (
//         <TimetableGrid
//           batch={selectedBatch}
//           slots={slots}
//           refresh={() => fetchSlots(selectedBatch)} // 🔥 critical
//         />
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import TimetableGrid from "../components/TimetableGrid";

// export default function MasterPage() {
//   const [batches, setBatches] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [slots, setSlots] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 🔹 Fetch all batches
//   const fetchBatches = async () => {
//     try {
//       setLoading(true);
//       const res = await fetch("http://localhost:5000/api/batches");

//       if (!res.ok) throw new Error("Failed to fetch batches");

//       const data = await res.json();

//       const batchNames = data.map((b) => b.name?.trim()).filter(Boolean);

//       setBatches(batchNames);

//       if (batchNames.length > 0 && !selectedBatch) {
//         setSelectedBatch(batchNames[0]);
//       }

//     } catch (err) {
//       console.error(err);
//       setError("Failed to load batches");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Fetch slots for selected batch
//   const fetchSlots = async (batch) => {
//     if (!batch) return;

//     try {
//       setLoading(true);
//       setError("");

//       const res = await fetch(
//         `http://localhost:5000/api/batches/${batch}/schedule`
//       );

//       if (!res.ok) {
//         const msg = await res.json();
//         throw new Error(msg.error || "Failed to fetch slots");
//       }

//       const data = await res.json();
//       setSlots(data);

//     } catch (err) {
//       console.error(err);
//       setSlots([]);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Initial load
//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   // 🔹 Fetch slots when batch changes
//   useEffect(() => {
//     fetchSlots(selectedBatch);
//   }, [selectedBatch]);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">Master Timetable</h2>

//       {/* Batch Selector */}
//       <div className="mb-4">
//         <label className="mr-2 font-medium">Select Batch:</label>

//         <select
//           value={selectedBatch}
//           onChange={(e) => setSelectedBatch(e.target.value)}
//           className="border p-1 rounded"
//         >
//           {batches.map((b) => (
//             <option key={b} value={b}>
//               {b}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Status */}
//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-500">{error}</p>}

//       {/* Timetable */}
//       {!loading && selectedBatch && (
//         <TimetableGrid
//           key={selectedBatch} // 🔥 forces re-render
//           batch={selectedBatch}
//           slots={slots}
//           refresh={() => fetchSlots(selectedBatch)} // 🔥 critical for add/delete
//         />
//       )}
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import TimetableGrid from "../components/TimetableGrid";

// export default function MasterPage() {
//   const [batches, setBatches] = useState([]);
//   const [selectedBatch, setSelectedBatch] = useState("");
//   const [slots, setSlots] = useState([]);

//   // 🔗 Fetch all batches
//   const fetchBatches = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/batches");
//       const data = await res.json();

//       const batchNames = data.map((b) => b.name);
//       setBatches(batchNames);

//       if (batchNames.length > 0) {
//         setSelectedBatch(batchNames[0]);
//       }
//     } catch (err) {
//       console.error("Error fetching batches:", err);
//     }
//   };

//   // 🔗 Fetch slots for selected batch
//   const fetchSlots = async (batch) => {
//     if (!batch) return;

//     try {
//       const res = await fetch(
//         `http://localhost:5000/api/batches/${batch}/schedule`
//       );
//       const data = await res.json();
//       setSlots(data);
//     } catch (err) {
//       console.error("Error fetching slots:", err);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   // When batch changes → fetch slots
//   useEffect(() => {
//     fetchSlots(selectedBatch);
//   }, [selectedBatch]);

//   return (
//     <div>
//       <h2>Master Timetable</h2>

//       {/* Batch Selector */}
//       <div style={{ marginBottom: 20 }}>
//         <label>Select Batch: </label>
//         <select
//           value={selectedBatch}
//           onChange={(e) => setSelectedBatch(e.target.value)}
//         >
//           {batches.map((b) => (
//             <option key={b} value={b}>
//               {b}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Timetable Grid */}
//       {selectedBatch && (
//         <TimetableGrid
//           batch={selectedBatch}
//           slots={slots}
//           refresh={() => fetchSlots(selectedBatch)}
//         />
//       )}
//     </div>
//   );
// }
// // import { useState } from "react";
// // import { useStore } from "../store/useStore";

// // const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// // const timeSlots = [
// //   "8-9", "9-10", "10-11", "11-12",
// //   "12-1", "1-2", "2-3", "3-4" , "4-5" ,"5-6"
// // ];

// // export default function MasterPage() {
// //   const { slots, addSlot, deleteSlot } = useStore();

// //   const [batches, setBatches] = useState(["Batch A"]);
// //   const [newBatch, setNewBatch] = useState("");

// //   const [activeCell, setActiveCell] = useState(null);
// //   const [formData, setFormData] = useState({
// //     subject: "",
// //     faculty: "",
// //     room: "",
// //     subBatch: "",
// //     batch: "Batch A"
// //   });

// //   const addBatch = () => {
// //     if (!newBatch) return;
// //     if (batches.includes(newBatch)) return;
// //     setBatches([...batches, newBatch]);
// //     setNewBatch("");
// //   };

// //   const handleSubmit = () => {
// //     if (!formData.subject) return;

// //     addSlot({ ...formData, ...activeCell });

// //     setFormData({
// //       subject: "",
// //       faculty: "",
// //       room: "",
// //       subBatch: "",
// //       batch: formData.batch
// //     });

// //     setActiveCell(null);
// //   };

// //   return (
// //     <div>
// //       <h2>Master Timetable</h2>

// //       {/* Add Batch */}
// //       <div style={{ marginBottom: 20 }}>
// //         <input
// //           placeholder="Enter new batch"
// //           value={newBatch}
// //           onChange={(e) => setNewBatch(e.target.value)}
// //         />
// //         <button onClick={addBatch}>Add Batch</button>
// //       </div>

// //       {/* Render multiple batch tables */}
// //       {batches.map((batch) => (
// //         <div key={batch} style={{ marginBottom: 40 }}>
// //           <h3>{batch}</h3>

// //           <table border="1" cellPadding="10">
// //             <thead>
// //               <tr>
// //                 <th>Day/Time</th>
// //                 {timeSlots.map((t) => (
// //                   <th key={t}>{t}</th>
// //                 ))}
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {days.map((day) => (
// //                 <tr key={day}>
// //                   <td><b>{day}</b></td>

// //                   {timeSlots.map((time) => {
// //                     const cellSlots = slots.filter(
// //                       (s) =>
// //                         s.batch === batch &&
// //                         s.day === day &&
// //                         s.time === time
// //                     );

// //                     return (
// //                       <td
// //                         key={time}
// //                         onClick={() => {
// //                           setActiveCell({ day, time });
// //                           setFormData((prev) => ({ ...prev, batch }));
// //                         }}
// //                         style={{ cursor: "pointer", minWidth: "120px" }}
// //                       >
// //                         {cellSlots.map((s) => (
// //                           <div key={s.id}>
// //                             {s.subject} ({s.subBatch})<br />
// //                             {s.faculty} | {s.room}
// //                           </div>
// //                         ))}
// //                       </td>
// //                     );
// //                   })}
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       ))}

// //       {/* Modal */}
// //       {activeCell && (
// //         <div style={{ border: "1px solid black", padding: 10 }}>
// //           <h3>
// //             {formData.batch} | {activeCell.day} - {activeCell.time}
// //           </h3>

// //           {slots
// //             .filter(
// //               (s) =>
// //                 s.batch === formData.batch &&
// //                 s.day === activeCell.day &&
// //                 s.time === activeCell.time
// //             )
// //             .map((s) => (
// //               <div key={s.id}>
// //                 {s.subject} | {s.faculty} | {s.room}
// //                 <button onClick={() => deleteSlot(s.id)}>Delete</button>
// //               </div>
// //             ))}

// //           <h4>Add Entry</h4>

// //           <input
// //             placeholder="Subject"
// //             value={formData.subject}
// //             onChange={(e) =>
// //               setFormData({ ...formData, subject: e.target.value })
// //             }
// //           />

// //           <input
// //             placeholder="Faculty"
// //             value={formData.faculty}
// //             onChange={(e) =>
// //               setFormData({ ...formData, faculty: e.target.value })
// //             }
// //           />

// //           <input
// //             placeholder="Room"
// //             value={formData.room}
// //             onChange={(e) =>
// //               setFormData({ ...formData, room: e.target.value })
// //             }
// //           />

// //           <input
// //             placeholder="Sub-batch"
// //             value={formData.subBatch}
// //             onChange={(e) =>
// //               setFormData({ ...formData, subBatch: e.target.value })
// //             }
// //           />

// //           <br /><br />

// //           <button onClick={handleSubmit}>Save</button>
// //           <button onClick={() => setActiveCell(null)}>Close</button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
