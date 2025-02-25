// 1. Lấy phần tử <canvas> qua id
const ctx = document.getElementById("timeChart").getContext("2d");

// 2. Mảng lưu thời gian (labels) và giá trị (data)
let labels = [];
let dataPoints = [];

// 3. Tạo biểu đồ
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Giá trị theo thời gian",
        data: dataPoints,
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        fill: true,
        tension: 0.1,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Thời gian (HH:mm:ss)",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Giá trị đo",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
  },
});

// 4. Viết hàm tiện ích lấy giờ-phút-giây (HH:mm:ss)
function getCurrentTimeString() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

// 5. Hàm cập nhật dữ liệu (có thể gọi thủ công hoặc dùng setInterval)
function updateChartData() {
  // Tạo giá trị đo giả lập [10..109]
  const newValue = Math.floor(Math.random() * 100) + 10;

  labels.push(getCurrentTimeString());
  dataPoints.push(newValue);

  // Giới hạn 20 điểm gần nhất
  if (labels.length > 60) {
    labels.shift();
    dataPoints.shift();
  }

  // Cập nhật biểu đồ
  myChart.update();
}

// 6. Gọi hàm cập nhật dữ liệu mỗi 1 giây (nếu muốn mô phỏng realtime)
setInterval(updateChartData, 100);




  document.getElementById('detection-method').addEventListener('change', function() {
    var method = this.value;
    if (method === 'eis') {
      document.getElementById('start-label').textContent = 'Start F:';
      document.getElementById('end-label').textContent = 'End F:';
      document.getElementById('step-label').textContent = 'Step F:';
      document.getElementById('repeat-label').textContent = 'Repeat Times F:';
    } else {
      document.getElementById('start-label').textContent = 'Start Voltage (mV):';
      document.getElementById('end-label').textContent = 'End Voltage (mV):';
      document.getElementById('step-label').textContent = 'Step (mV):';
      document.getElementById('repeat-label').textContent = 'Repeat Times:';
    }
  });
