/*import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Button } from "@mui/material";

// Color scheme for charts
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ChartComponent = ({ data }) => {
    const [chartType, setChartType] = useState("bar"); // Default to bar chart

    return (
        <div>
            <h3>Financial Insights</h3>
            <div style={{ marginBottom: "10px" }}>
                <Button variant="contained" onClick={() => setChartType("bar")} style={{ marginRight: "10px" }}>Bar Chart</Button>
                <Button variant="contained" onClick={() => setChartType("line")} style={{ marginRight: "10px" }}>Line Chart</Button>
                <Button variant="contained" onClick={() => setChartType("pie")}>Pie Chart</Button>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                {chartType === "bar" && (
                    <BarChart data={data}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                )}
                {chartType === "line" && (
                    <LineChart data={data}>
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                )}
                {chartType === "pie" && (
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} label>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default ChartComponent;*/
/*import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ChartComponent = () => {
    const [chart, setChart] = useState(null);
    const [fallbackData, setFallbackData] = useState(null);
    const [error, setError] = useState("");

    const handleVisualize = async () => {
        setError(""); // Reset error message
        try {
            const response = await fetch("http://localhost:8000/visualize/", { method: "POST" });
            const data = await response.json();

            if (data.graph) {
                setChart(data.graph); // Set Plotly-generated graph HTML
            } else if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            setError("⚠️ Failed to fetch visualization. Please try again.");
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "auto" }}>
            <h3>📊 Financial Data Visualization</h3>
            <button onClick={handleVisualize} style={{ marginBottom: "10px" }}>Visualize</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {chart ? (
                <div dangerouslySetInnerHTML={{ __html: chart }} />
            ) : fallbackData ? (
                <Bar data={fallbackData} />
            ) : (
                <p style={{ color: "red" }}>⚠️ No visualization data available.</p>
            )}
        </div>
    );
};

export default ChartComponent;*/
// import React, { useEffect, useRef } from "react";
// import Plotly from "plotly.js-dist"; // ✅ Ensure Plotly is imported

// const ChartComponent = ({ chartHTML }) => {
//     const chartContainer = useRef(null);

//     useEffect(() => {
//         if (chartContainer.current && chartHTML) {
//             try {
//                 // ✅ Parse JSON string into a JavaScript object
//                 const graphData = JSON.parse(chartHTML);

//                 // ✅ Render the chart using Plotly
//                 Plotly.react(chartContainer.current, graphData.data, graphData.layout);
//             } catch (error) {
//                 console.error("Error parsing Plotly JSON:", error);
//             }
//         }
//     }, [chartHTML]);

//     return (
//         <div style={{ maxWidth: 800, margin: "auto" }}>
//             <h3>📊 Financial Data Visualization</h3>
//             <div ref={chartContainer} /> {/* ✅ The chart will render here */}
//         </div>
//     );
// };

// export default ChartComponent;
import React, { useEffect, useRef } from "react";
import Plotly from "plotly.js-dist";

const ChartComponent = ({ chartHTML }) => {
    const chartContainer = useRef(null);

    useEffect(() => {
        if (chartContainer.current && chartHTML) {
            try {
                // Try to parse the JSON string
                const graphData = JSON.parse(chartHTML);
                Plotly.react(chartContainer.current, graphData.data, graphData.layout);
            } catch (error) {
                console.error("Error parsing Plotly JSON:", error);
                // If JSON parsing fails, display the error text
                chartContainer.current.innerHTML = `<p style="color: red; text-align: center;">${chartHTML}</p>`;
            }
        }
    }, [chartHTML]);

    return (
        <div style={{ maxWidth: 800, margin: "auto" }}>
            <h3>📊 Financial Data Visualization</h3>
            <div ref={chartContainer} />
        </div>
    );
};

export default ChartComponent;




