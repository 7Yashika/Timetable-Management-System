import { useState } from "react";
import SlotCell from "./SlotCell";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const times = [
  "8-9","9-10","10-11","11-12",
  "12-1","1-2","2-3","3-4","4-5","5-6"
];

const dayColors = {
  Mon: { bg: "#eff6ff", color: "#1d4ed8" },
  Tue: { bg: "#f5f3ff", color: "#6d28d9" },
  Wed: { bg: "#ecfdf5", color: "#065f46" },
  Thu: { bg: "#fffbeb", color: "#92400e" },
  Fri: { bg: "#fff1f2", color: "#9f1239" },
  Sat: { bg: "#f1f5f9", color: "#475569" },
};

export default function TimetableGrid({ batch, slots = [], refresh }) {
  const [hoveredRow, setHoveredRow] = useState(null);

  return (
    <div style={{ overflowX: "auto", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,.06)", fontFamily: "'DM Sans', sans-serif" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12, tableLayout: "fixed", minWidth: 920 }}>

        {/* ── HEADER ── */}
        <thead>
          <tr style={{ background: "#1e293b" }}>
            <th style={{
              padding: "11px 14px", textAlign: "left", width: 80,
              fontFamily: "'DM Mono', monospace", fontSize: 9,
              color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em",
              borderRight: "1px solid #334155", fontWeight: 500,
            }}>
              Day
            </th>
            {times.map((t) => (
              <th key={t} style={{
                padding: "11px 6px",
                fontFamily: "'DM Mono', monospace", fontSize: 9,
                color: "#cbd5e1", letterSpacing: ".06em",
                borderRight: "1px solid #334155", fontWeight: 500,
                whiteSpace: "nowrap",
              }}>
                {t}
              </th>
            ))}
          </tr>
        </thead>

        {/* ── BODY ── */}
        <tbody>
          {days.map((day, i) => (
            <tr
              key={day}
              onMouseEnter={() => setHoveredRow(day)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                background: hoveredRow === day
                  ? "#fffbeb"
                  : i % 2 === 0 ? "#ffffff" : "rgba(248,250,252,.6)",
                transition: "background .12s ease",
              }}
            >
              {/* Day cell */}
              <td style={{
                padding: "10px 10px",
                borderRight: "1px solid #e2e8f0",
                borderBottom: "1px solid #e2e8f0",
                verticalAlign: "middle",
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  padding: "3px 8px", borderRadius: 7,
                  fontFamily: "'DM Mono', monospace",
                  background: dayColors[day]?.bg,
                  color: dayColors[day]?.color,
                  display: "inline-block",
                }}>
                  {day}
                </span>
              </td>

              {/* Time slot cells */}
              {times.map((time) => {
                const cellSlots = slots.filter(
                  (s) => s.day === day && s.time === time && s.batch === batch
                );

                return (
                  <td
                    key={time}
                    style={{
                      borderRight: "1px solid #e2e8f0",
                      borderBottom: "1px solid #e2e8f0",
                      verticalAlign: "top",
                      height: 105,
                      padding: 0,
                    }}
                  >
                    <SlotCell
                      day={day}
                      time={time}
                      batch={batch}
                      slots={cellSlots}
                      refresh={refresh}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}
// import SlotCell from "./SlotCell";

// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const times = [
//   "8-9","9-10","10-11","11-12",
//   "12-1","1-2","2-3","3-4","4-5","5-6"
// ];

// export default function TimetableGrid({ batch, slots = [], refresh }) {
//   return (
//     <div className="overflow-x-auto">
//       <table className="border-collapse w-full text-sm table-fixed shadow rounded-xl overflow-hidden">
        
//         {/* HEADER */}
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border p-3 w-[100px] font-semibold">Day/Time</th>
//             {times.map((t) => (
//               <th key={t} className="border p-2 font-medium">
//                 {t}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         {/* BODY */}
//         <tbody>
//           {days.map((day) => (
//             <tr key={day} className="hover:bg-gray-50">
              
//               {/* DAY COLUMN */}
//               <td className="border p-3 font-semibold bg-gray-50">
//                 {day}
//               </td>

//               {/* TIME CELLS */}
//               {times.map((time) => {
//                 const cellSlots = slots.filter(
//                   (s) =>
//                     s.day === day &&
//                     s.time === time &&
//                     s.batch === batch
//                 );

//                 return (
//                   <td
//                     key={time}
//                     className="border align-top h-[110px] p-1"
//                   >
//                     <SlotCell
//                       day={day}
//                       time={time}
//                       batch={batch}
//                       slots={cellSlots}
//                       refresh={refresh}
//                     />
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>

//       </table>
//     </div>
//   );
// }
//  import SlotCell from "./SlotCell";

// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const times = [
//   "8-9","9-10","10-11","11-12",
//   "12-1","1-2","2-3","3-4","4-5","5-6"
// ];

// export default function TimetableGrid({ batch, slots = [], refresh }) {
//   return (
//     <table className="border-collapse border w-full text-sm table-fixed">
//       <thead>
//         <tr>
//           <th className="border p-2 bg-gray-100 w-[100px]">Day/Time</th>
//           {times.map((t) => (
//             <th key={t} className="border p-2 bg-gray-100">
//               {t}
//             </th>
//           ))}
//         </tr>
//       </thead>

//       <tbody>
//         {days.map((day) => (
//           <tr key={day}>
//             {/* ✅ FIXED DAY COLUMN */}
//             <td className="border p-2 font-bold bg-gray-50 w-[100px]">
//               {day}
//             </td>

//             {/* ✅ CORRECT CELLS */}
//             {times.map((time) => {
//               const cellSlots = slots.filter(
//                 (s) =>
//                   s.day === day &&
//                   s.time === time &&
//                   s.batch === batch
//               );

//               return (
//                 <td
//                   key={time}
//                   className="border align-top p-1 h-[100px]"
//                 >
//                   <SlotCell
//                     day={day}
//                     time={time}
//                     batch={batch}
//                     slots={cellSlots}
//                     refresh={refresh}
//                   />
//                 </td>
//               );
//             })}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }// import SlotCell from "./SlotCell";

// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const times = [
//   "8-9","9-10","10-11","11-12",
//   "12-1","1-2","2-3","3-4","4-5","5-6"
// ];

// export default function TimetableGrid({ batch, slots = [], refresh }) {
//   return (
//     <table className="border-collapse border w-full text-sm table-fixed">
//       <thead>
//         <tr>
//           <th className="border p-2 bg-gray-100">Day/Time</th>
//           {times.map((t) => (
//             <th key={t} className="border p-2 bg-gray-100">
//               {t}
//             </th>
//           ))}
//         </tr>
//       </thead>

//       <tbody>
//         {days.map((day) => (
//           <tr key={day}>
//             {/* ✅ FIXED DAY COLUMN */}
//             <td className="border p-2 font-bold bg-gray-50">
//               {day}
//             </td>

//             {times.map((time) => {
//               const cellSlots = slots.filter(
//                 (s) =>
//                   s.day === day &&
//                   s.time === time &&
//                   s.batch === batch
//               );

//               return (
//                 <td key={time} className="border align-top p-1 h-[90px]">
//                   <SlotCell
//                     day={day}
//                     time={time}
//                     batch={batch}
//                     slots={cellSlots}
//                     refresh={refresh}
//                   />
//                 </td>
//               );
//             })}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }


// above is updated
// import SlotCell from "./SlotCell";

// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const times = [
//   "8-9","9-10","10-11","11-12",
//   "12-1","1-2","2-3","3-4","4-5","5-6"
// ];

// export default function TimetableGrid({ batch, slots = [], refresh }) {
//   return (
//     <table className="border-collapse border w-full text-sm">
//       <thead>
//         <tr>
//           <th className="border p-2 bg-gray-100">Day/Time</th>
//           {times.map((t) => (
//             <th key={t} className="border p-2 bg-gray-100">
//               {t}
//             </th>
//           ))}
//         </tr>
//       </thead>

//       <tbody>
//         {days.map((day) => (
//           <tr key={day}>
//             <td className="border p-2 font-bold bg-gray-50">
//               {day}
//             </td>

//             {times.map((time) => {
//               // 🔥 IMPORTANT: filter slots for THIS cell
//               const cellSlots = slots.filter(
//                 (s) =>
//                   s.day === day &&
//                   s.time === time &&
//                   s.batch === batch
//               );

//               return (
//                 <td key={time} className="border align-top">
//                   <SlotCell
//                     day={day}
//                     time={time}
//                     batch={batch}
//                     slots={cellSlots}   // ✅ pass filtered slots
//                     refresh={refresh}
//                   />
//                 </td>
//               );
//             })}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// import SlotCell from "./SlotCell";

// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// const times = [
//   "8-9","9-10","10-11","11-12",
//   "12-1","1-2","2-3","3-4","4-5","5-6"
// ];

// export default function TimetableGrid({ batch, slots, refresh }) {
//   return (
//     <table className="border-collapse border w-full text-sm">
//       <thead>
//         <tr>
//           <th className="border p-2">Day/Time</th>
//           {times.map((t) => (
//             <th key={t} className="border p-2">{t}</th>
//           ))}
//         </tr>
//       </thead>

//       <tbody>
//         {days.map((day) => (
//           <tr key={day}>
//             <td className="border p-2 font-bold">{day}</td>

//             {times.map((time) => (
//               <td key={time} className="border">
//                 <SlotCell
//                   day={day}
//                   time={time}
//                   batch={batch}
//                   slots={slots}
//                   refresh={refresh}
//                 />
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
