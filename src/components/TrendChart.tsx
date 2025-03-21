import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export function TrendChart({ geoid, values }: { geoid: string; values: Record<string, number> }) {
  const labels = Object.keys(values);
  const data = Object.values(values);

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-lg font-semibold mb-2">Trend for GEOID: {geoid}</h2>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Predicted Intensity",
              data,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        }}
      />
    </div>
  );
}
