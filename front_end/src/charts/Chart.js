import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function Chart({ ideas }) {

  const approved = ideas.filter(i => i.status === "Approved").length;
  const pending = ideas.filter(i => i.status === "submitted").length;
  const rejected = ideas.filter(i => i.status === "Rejected").length;

  const data = [
    { name: "Approved", value: approved },
    { name: "Pending", value: pending },
    { name: "Rejected", value: rejected },
  ];

  const COLORS = ["#198754", "#ffc107", "#dc3545"];

  return (
    <div className="card shadow-sm rounded-4 p-4">
      <h5>Idea Status Distribution</h5>
      <div style={{ height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={100}
              label={({ name }) => name}   // 👈 This fixes it
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;