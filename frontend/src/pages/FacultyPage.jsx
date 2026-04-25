import { useEffect, useState } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const timeSlots = [
  "8-9", "9-10", "10-11", "11-12",
  "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"
];

const dayColors = {
  Mon: { bg: "#eff6ff", color: "#1d4ed8" },
  Tue: { bg: "#f5f3ff", color: "#6d28d9" },
  Wed: { bg: "#ecfdf5", color: "#065f46" },
  Thu: { bg: "#fffbeb", color: "#92400e" },
  Fri: { bg: "#fff1f2", color: "#9f1239" },
  Sat: { bg: "#f1f5f9", color: "#475569" },
};

export default function FacultyPage() {
  const [slots, setSlots] = useState([]);

  // 🔗 Fetch slots
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/slots")
      .then((res) => res.json())
      .then((data) => setSlots(data))
      .catch((err) => console.error(err));
  }, []);

  // Extract unique faculties
  const faculties = [...new Set(slots.map((s) => s.faculty))];

  return (
    <div style={{ padding: 24, fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 }}>
          Faculty Timetable
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
          Per-faculty schedule across all classes
        </p>
      </div>

      {faculties.length === 0 && (
        <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "32px 0" }}>
          No faculty data available.
        </p>
      )}

      {/* ── Per-Faculty Block ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
        {faculties.map((faculty) => {
          const count = slots.filter((s) => s.faculty === faculty).length;
          const initials = faculty?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

          return (
            <div key={faculty}>

              {/* Faculty name row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: "#1e293b", color: "#ffffff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, flexShrink: 0,
                }}>
                  {initials}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{faculty}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                    {count} slot{count !== 1 ? "s" : ""} assigned
                  </div>
                </div>
              </div>

              {/* Table */}
              <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
                <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 11, tableLayout: "fixed", minWidth: 820 }}>
                  <thead>
                    <tr style={{ background: "#1e293b" }}>
                      <th style={{ padding: "10px 12px", textAlign: "left", width: 72, fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em", borderRight: "1px solid #334155" }}>
                        Day
                      </th>
                      {timeSlots.map((t) => (
                        <th key={t} style={{ padding: "10px 6px", fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#cbd5e1", letterSpacing: ".06em", borderRight: "1px solid #334155", fontWeight: 500 }}>
                          {t}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {days.map((day, i) => (
                      <tr key={day} style={{ background: i % 2 === 0 ? "#ffffff" : "rgba(248,250,252,.6)" }}>
                        <td style={{ padding: "10px 10px", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
                          <span style={{
                            fontSize: 10, fontWeight: 700, padding: "3px 7px",
                            borderRadius: 7, fontFamily: "'DM Mono', monospace",
                            background: dayColors[day]?.bg, color: dayColors[day]?.color,
                          }}>
                            {day}
                          </span>
                        </td>

                        {timeSlots.map((time) => {
                          const filtered = slots.filter(
                            (s) => s.faculty === faculty && s.day === day && s.time === time
                          );

                          return (
                            <td key={time} style={{ borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: 5, verticalAlign: "top", minHeight: 54 }}>
                              {filtered.map((s) => (
                                <div key={s._id} style={{
                                  background: "#fffbeb", border: "1px solid #fde68a",
                                  borderRadius: 8, padding: "5px 7px", marginBottom: 3,
                                }}>
                                  <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {s.subject} ({s.batch})
                                  </div>
                                  <div style={{ fontSize: 9, color: "#b45309", fontWeight: 600, marginTop: 1 }}>
                                    Sub: {s.subBatch ? s.subBatch : "ALL"}
                                  </div>
                                  <div style={{ fontSize: 9, color: "#64748b", fontFamily: "'DM Mono', monospace", marginTop: 1 }}>
                                    {s.room_number || s.room_id || s.lab_id || "—"}
                                  </div>
                                </div>
                              ))}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
// import { useEffect, useState } from "react";

// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const timeSlots = [
//   "8-9", "9-10", "10-11", "11-12",
//   "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"
// ];

// export default function FacultyPage() {
//   const [slots, setSlots] = useState([]);

//   // 🔗 Fetch slots
//   useEffect(() => {
//     fetch("http://127.0.0.1:5000/api/slots")
//       .then((res) => res.json())
//       .then((data) => setSlots(data))
//       .catch((err) => console.error(err));
//   }, []);

//   // ✅ DELETE FUNCTION
//   const handleDelete = async (id) => {
//     console.log("Deleting ID:", id);

//     try {
//       const res = await fetch("http://127.0.0.1:5000/api/slots", {
//         method: "DELETE",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ id })
//       });

//       const data = await res.json();
//       console.log(data);

//       if (res.ok) {
//         // remove from UI
//         setSlots(prev => prev.filter(s => s._id !== id));
//       } else {
//         alert("Delete error");
//       }

//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   const faculties = [...new Set(slots.map((s) => s.faculty))];

//   return (
//     <div style={{ padding: 24 }}>

//       <h2>Faculty Timetable</h2>

//       {faculties.map((faculty) => (
//         <div key={faculty} style={{ marginBottom: 30 }}>

//           <h3>{faculty}</h3>

//           <table border="1" cellPadding="10">
//             <thead>
//               <tr>
//                 <th>Day/Time</th>
//                 {timeSlots.map((t) => (
//                   <th key={t}>{t}</th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {days.map((day) => (
//                 <tr key={day}>
//                   <td><b>{day}</b></td>

//                   {timeSlots.map((time) => {
//                     const filtered = slots.filter(
//                       (s) =>
//                         s.faculty === faculty &&
//                         s.day === day &&
//                         s.time === time
//                     );

//                     return (
//                       <td key={time}>
//                         {filtered.map((s) => (
//                           <div key={s._id} style={{ marginBottom: 5 }}>

//                             <div>
//                               {s.subject} ({s.batch})
//                             </div>

//                             <div>
//                               Sub: {s.subBatch || "ALL"}
//                             </div>

//                             <div>
//                               {s.room_number || "—"}
//                             </div>

//                             {/* ✅ REMOVE BUTTON */}
//                             <button
//                               onClick={() => handleDelete(s._id)}
//                               style={{
//                                 marginTop: 5,
//                                 padding: "4px 8px",
//                                 background: "red",
//                                 color: "white",
//                                 border: "none",
//                                 borderRadius: 4,
//                                 cursor: "pointer"
//                               }}
//                             >
//                               Remove
//                             </button>

//                           </div>
//                         ))}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//         </div>
//       ))}
//     </div>
//   );
// }// import { useEffect, useState } from "react";

// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const timeSlots = [
//   "8-9", "9-10", "10-11", "11-12",
//   "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"
// ];

// const dayColors = {
//   Mon: { bg: "#eff6ff", color: "#1d4ed8" },
//   Tue: { bg: "#f5f3ff", color: "#6d28d9" },
//   Wed: { bg: "#ecfdf5", color: "#065f46" },
//   Thu: { bg: "#fffbeb", color: "#92400e" },
//   Fri: { bg: "#fff1f2", color: "#9f1239" },
//   Sat: { bg: "#f1f5f9", color: "#475569" },
// };

// export default function FacultyPage() {
//   const [slots, setSlots] = useState([]);

//   // 🔗 Fetch slots
//   useEffect(() => {
//     fetch("http://127.0.0.1:5000/api/slots")
//       .then((res) => res.json())
//       .then((data) => setSlots(data))
//       .catch((err) => console.error(err));
//   }, []);

//   // Extract unique faculties
//   const faculties = [...new Set(slots.map((s) => s.faculty))];

//   return (
//     <div style={{ padding: 24, fontFamily: "'DM Sans', sans-serif" }}>

//       {/* ── Page Header ── */}
//       <div style={{ marginBottom: 28 }}>
//         <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", margin: 0 }}>
//           Faculty Timetable
//         </h2>
//         <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
//           Per-faculty schedule across all classes
//         </p>
//       </div>

//       {faculties.length === 0 && (
//         <p style={{ color: "#94a3b8", fontSize: 13, textAlign: "center", padding: "32px 0" }}>
//           No faculty data available.
//         </p>
//       )}

//       {/* ── Per-Faculty Block ── */}
//       <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
//         {faculties.map((faculty) => {
//           const count = slots.filter((s) => s.faculty === faculty).length;
//           const initials = faculty?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

//           return (
//             <div key={faculty}>

//               {/* Faculty name row */}
//               <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
//                 <div style={{
//                   width: 40, height: 40, borderRadius: 12,
//                   background: "#1e293b", color: "#ffffff",
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontSize: 14, fontWeight: 700, flexShrink: 0,
//                 }}>
//                   {initials}
//                 </div>
//                 <div>
//                   <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>{faculty}</div>
//                   <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
//                     {count} slot{count !== 1 ? "s" : ""} assigned
//                   </div>
//                 </div>
//               </div>

//               {/* Table */}
//               <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,.05)" }}>
//                 <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 11, tableLayout: "fixed", minWidth: 820 }}>
//                   <thead>
//                     <tr style={{ background: "#1e293b" }}>
//                       <th style={{ padding: "10px 12px", textAlign: "left", width: 72, fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em", borderRight: "1px solid #334155" }}>
//                         Day
//                       </th>
//                       {timeSlots.map((t) => (
//                         <th key={t} style={{ padding: "10px 6px", fontFamily: "'DM Mono', monospace", fontSize: 9, color: "#cbd5e1", letterSpacing: ".06em", borderRight: "1px solid #334155", fontWeight: 500 }}>
//                           {t}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {days.map((day, i) => (
//                       <tr key={day} style={{ background: i % 2 === 0 ? "#ffffff" : "rgba(248,250,252,.6)" }}>
//                         <td style={{ padding: "10px 10px", borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
//                           <span style={{
//                             fontSize: 10, fontWeight: 700, padding: "3px 7px",
//                             borderRadius: 7, fontFamily: "'DM Mono', monospace",
//                             background: dayColors[day]?.bg, color: dayColors[day]?.color,
//                           }}>
//                             {day}
//                           </span>
//                         </td>

//                         {timeSlots.map((time) => {
//                           const filtered = slots.filter(
//                             (s) => s.faculty === faculty && s.day === day && s.time === time
//                           );

//                           return (
//                             <td key={time} style={{ borderRight: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", padding: 5, verticalAlign: "top", minHeight: 54 }}>
//                               {filtered.map((s) => (
//                                 <div key={s._id} style={{
//                                   background: "#fffbeb", border: "1px solid #fde68a",
//                                   borderRadius: 8, padding: "5px 7px", marginBottom: 3,
//                                 }}>
//                                   <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                                     {s.subject} ({s.batch})
//                                   </div>
//                                   <div style={{ fontSize: 9, color: "#b45309", fontWeight: 600, marginTop: 1 }}>
//                                     Sub: {s.subBatch ? s.subBatch : "ALL"}
//                                   </div>
//                                   <div style={{ fontSize: 9, color: "#64748b", fontFamily: "'DM Mono', monospace", marginTop: 1 }}>
//                                     {s.room_number || s.room_id || s.lab_id || "—"}
//                                   </div>
//                                 </div>
//                               ))}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
// import { useEffect, useState } from "react";

// export default function FacultyPage() {
//   const [slots, setSlots] = useState([]);

//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const timeSlots = [
//     "8-9", "9-10", "10-11", "11-12",
//     "12-1", "1-2", "2-3", "3-4", "4-5", "5-6"
//   ];

//   // 🔗 Fetch slots (you can change batch name if needed)
//   // useEffect(() => {
//   //   fetch("http://localhost:5000/api/batches/CSE-A/schedule")
//   //     .then((res) => res.json())
//   //     .then((data) => setSlots(data))
//   //     .catch((err) => console.error(err));
//   // }, []);

// // upadted
// useEffect(() => {
//   fetch("http://127.0.0.1:5000/api/slots")
//     .then((res) => res.json())
//     .then((data) => setSlots(data))
//     .catch((err) => console.error(err));
// }, []);

//   // Extract unique faculties
//   const faculties = [...new Set(slots.map((s) => s.faculty))];

//   return (
//     <div>
//       <h2>Faculty Timetable</h2>

//       {faculties.map((faculty) => (
//         <div key={faculty} style={{ marginBottom: 30 }}>
//           <h3>{faculty}</h3>

//           <table border="1" cellPadding="10">
//             <thead>
//               <tr>
//                 <th>Day/Time</th>
//                 {timeSlots.map((t) => (
//                   <th key={t}>{t}</th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {days.map((day) => (
//                 <tr key={day}>
//                   <td><b>{day}</b></td>

//                   {timeSlots.map((time) => {
//                     const filtered = slots.filter(
//                       (s) =>
//                         s.faculty === faculty &&
//                         s.day === day &&
//                         s.time === time
//                     );

//                     return (
//                       <td key={time}>
//                         {filtered.map((s) => (
//                           // <div key={s._id}>
//                           //   {s.subject} ({s.batch}-{s.subBatch || "ALL"})  
//                           //   <br />
//                           //   {s.room_number || s.room_id || s.lab_id } 
//                           // </div>
//                           //updated
//                           <div key={s._id}>
//                             {s.subject} ({s.batch})
//                             <br />
//                              Sub: {s.subBatch ? s.subBatch : "ALL"}
//                             <br />
//                             {s.room_number || s.room_id || s.lab_id}
//                           </div>
//                         ))}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }
// // =============================
// // pages/FacultyPage.jsx
// // =============================
// import { useStore } from "../store/useStore";

// export default function FacultyPage() {
//   const { slots } = useStore();

//   const faculties = [...new Set(slots.map((s) => s.faculty))];

//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const timeSlots = [
//     "8-9", "9-10", "10-11", "11-12",
//     "12-1", "1-2", "2-3", "3-4" , "4-5" ,"5-6"
//   ];

//   return (
//     <div>
//       <h2>Faculty Timetable</h2>

//       {faculties.map((faculty) => (
//         <div key={faculty} style={{ marginBottom: 30 }}>
//           <h3>{faculty}</h3>

//           <table border="1" cellPadding="10">
//             <thead>
//               <tr>
//                 <th>Day/Time</th>
//                 {timeSlots.map((t) => (
//                   <th key={t}>{t}</th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {days.map((day) => (
//                 <tr key={day}>
//                   <td><b>{day}</b></td>

//                   {timeSlots.map((time) => {
//                     const filtered = slots.filter(
//                       (s) =>
//                         s.faculty === faculty &&
//                         s.day === day &&
//                         s.time === time
//                     );

//                     return (
//                       <td key={time}>
//                         {filtered.map((s) => (
//                           <div key={s.id}>
//                             {s.subject} ({s.batch}-{s.subBatch})
//                             <br />
//                             {s.room}
//                           </div>
//                         ))}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }