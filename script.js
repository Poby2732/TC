document.addEventListener("DOMContentLoaded", function () {
    let balance = 0;
    let transactions = [];
    let currentTransactionType = "income";
    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML = `
        <option value="식비">식비</option>
        <option value="교통비">교통비</option>
        <option value="기타">기타</option>
        <option value="인건비">인건비</option>
        <option value="재료비">재료비</option>
        <option value="운영비">운영비</option>
    `;

    const setInitialBalanceBtn = document.getElementById("setInitialBalanceBtn");
    const saveInitialBalanceBtn = document.getElementById("saveInitialBalanceBtn");
    const addIncomeBtn = document.getElementById("addIncomeBtn");
    const addExpenseBtn = document.getElementById("addExpenseBtn");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const resultBtn = document.getElementById("resultBtn");

    // 초기 잔액 설정 버튼 클릭 이벤트
    setInitialBalanceBtn.addEventListener("click", function () {
        document.getElementById("initialBalanceSection").style.display = "block";
    });

    // 초기 잔액 저장 버튼 클릭 이벤트
    saveInitialBalanceBtn.addEventListener("click", function () {
        const initialBalance = parseFloat(document.getElementById("initialBalance").value);

        if (isNaN(initialBalance) || initialBalance < 0) {
            alert("유효한 금액을 입력해 주세요.");
            return;
        }

        balance = initialBalance;
        document.getElementById("balance").textContent = balance.toFixed(2);

        // 초기 잔액 입력 섹션 숨기기
        document.getElementById("initialBalanceSection").style.display = "none";
        document.getElementById("initialBalance").value = "";
    });

    // 수입 추가 버튼 클릭 이벤트
    addIncomeBtn.addEventListener("click", function () {
        document.getElementById("formSection").style.display = "block";
        currentTransactionType = "income"; // 수입
        document.getElementById("categorySection").style.display = "none"; // 카테고리 숨기기
    });

    // 지출 추가 버튼 클릭 이벤트
    addExpenseBtn.addEventListener("click", function () {
        document.getElementById("formSection").style.display = "block";
        currentTransactionType = "expense"; // 지출
        document.getElementById("categorySection").style.display = "block"; // 카테고리 표시
    });

    // 저장 버튼 클릭 이벤트
    saveBtn.addEventListener("click", function () {
        const amount = parseFloat(document.getElementById("amount").value);
        const date = document.getElementById("date").value;
        let category = "";

        if (currentTransactionType === "expense") {
            category = document.getElementById("category").value;
        }

        if (isNaN(amount) || amount <= 0 || !date) {
            alert("모든 필드를 유효하게 입력해 주세요.");
            return;
        }

        const transaction = { amount, date, category, type: currentTransactionType };
        transactions.push(transaction);

        // 잔액 계산
        if (currentTransactionType === "income") {
            balance += amount;
        } else {
            balance -= amount;
        }

        // 업데이트된 잔액 표시
        document.getElementById("balance").textContent = balance.toFixed(2);

        // 폼 초기화 및 숨기기
        document.getElementById("formSection").style.display = "none";
        document.getElementById("amount").value = "";
        document.getElementById("date").value = "";
        document.getElementById("category").value = "식비";
    });

    // 결과 버튼 클릭 이벤트
    resultBtn.addEventListener("click", function () {
        let totalIncome = 0;
        let totalExpense = 0;
        let expenseDetails = {};  // 지출 세부사항 저장용 객체

        transactions.forEach((transaction) => {
            if (transaction.type === "income") {
                totalIncome += transaction.amount;
            } else if (transaction.type === "expense") {
                totalExpense += transaction.amount;
                if (!expenseDetails[transaction.category]) {
                    expenseDetails[transaction.category] = 0;
                }
                expenseDetails[transaction.category] += transaction.amount;  // 각 카테고리별 금액 누적
            }
        });

        const netProfit = totalIncome - totalExpense;

        const dailyReport = `
            <p>총 수입: ${totalIncome.toFixed(2)} 원</p>
            <p>총 지출: ${totalExpense.toFixed(2)} 원</p>
            <p>순이익: ${netProfit.toFixed(2)} 원</p>
            <p>현재 잔액: ${balance.toFixed(2)} 원</p>
        `;

        let expenseDetailsReport = "<p>지출 세부사항:</p><ul>";
        for (let category in expenseDetails) {
            expenseDetailsReport += `<li>${category}: ${expenseDetails[category].toFixed(2)} 원</li>`;  // 각 카테고리별 지출 내역 추가
        }
        expenseDetailsReport += "</ul>";

        document.getElementById("dailyReport").innerHTML = dailyReport + expenseDetailsReport;

        // 그래프 업데이트
        updateChart(totalIncome, totalExpense, netProfit);
    });

    // Chart.js를 사용하여 그래프 그리기
    let ctx = document.getElementById('financialChart').getContext('2d');
    let financialChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['수입', '지출', '순이익'],
            datasets: [{
                label: '하루 재무 상태',
                data: [0, 0, 0],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(75, 192, 192, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(75, 192, 192, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    function updateChart(income, expense, netProfit) {
        financialChart.data.datasets[0].data = [income, expense, netProfit];
        financialChart.update();
    }

    // 계산기 함수
    window.appendToCalc = function (value) {
        document.getElementById("calcDisplay").value += value;
    };

    window.clearCalc = function () {
        document.getElementById("calcDisplay").value = "";
    };

    window.calculateResult = function () {
        try {
            const result = eval(document.getElementById("calcDisplay").value);
            document.getElementById("calcDisplay").value = result;
        } catch (e) {
            alert("잘못된 입력입니다.");
        }
    };
});
