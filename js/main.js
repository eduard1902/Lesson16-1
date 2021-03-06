'use strict';

const start = document.getElementById('start'),
    cancel = document.getElementById('cancel'),                                
    btnPlus = document.getElementsByTagName('button'), 
    incomePlus = btnPlus[0],
    expensesPlus = btnPlus[1],
    depositCheck = document.getElementById('deposit-check'),                        //Чекбокс 
    additionalIncomeItem = document.querySelectorAll('.additional_income-item'),     // Ввода возможных доходов
    salaryAmount = document.querySelector('.salary-amount'),                        //Месячный доход*
    additionalInputncome1 = document.querySelectorAll('.additional_income-item')[0], //Возможный доход
    additionalInputncome2 = document.querySelectorAll('.additional_income-item')[1], //Возможный доход
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),   //Возможные расходы 
    targetAmount = document.querySelector('.target-amount'),                        // Цель
    periodSelect = document.querySelector('.period-select'),                        // Период расчета
    periodAmount = document.querySelector('.period-amount'),
    resultTotal = document.querySelector('.result-total'),                          // Доход за месяц
    budgetMonthValue = document.querySelector('.budget_month-value'),
    budgetDayValue = document.querySelector('.budget_day-value'),                   // Дневной бюджет
    expensesMonthValue = document.querySelector('.expenses_month-value'),           //Расход за месяц
    additionalIncomeValue = document.querySelector('.additional_income-value'),     //Возможные доходы
    incomePeriodValue = document.querySelector('.income_period-value'),             // Накопления за период 
    targetMonthValue = document.querySelector('.target_month-value'),              //Срок достижения цели в месяцах
    depositBank  = document.querySelector('.deposit-bank'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent');

let expensesTitle = document.querySelector('.expenses-title'), 
    incomeItems = document.querySelectorAll('.income-items'),
    expensesItems = document.querySelectorAll('.expenses-items'),                   // Обязательные расходы
    additionalExpensesValue = document.querySelector('.additional_expenses-value'); 


class AppData {
    constructor() {
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];    
    this.expenses = {};     
    this.addExpenses = [];  
    this.deposit = false; 
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
};

start() {
    if(salaryAmount.value === '') {
        alert('Заполните поле дохода!');
        return;
    }

    let allInput = document.querySelectorAll('.data input[type = text]');
    
    allInput.forEach(function(item){
        item.setAttribute('disabled','true');
    });

    expensesPlus.setAttribute('disabled','true');
        incomePlus.setAttribute('disabled','true');
        start.style.display = 'none';
        cancel.style.display = 'block';
        this.budget = +salaryAmount.value;
        this.getExpenses();
        this.getIncome();
        this.getExpensesMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.etInfoDeposit()
        this.getBudget();
        this.showResult();
};

reset(){

    let dataAllInput = document.querySelectorAll('.data input[type = text]');
        
    let resultInputAll = document.querySelectorAll('.result input[type = text]');
        
    dataAllInput.forEach(function(elem){
        elem.value = '';
        elem.removeAttribute('disabled');
        periodSelect.value = '0';
        periodAmount.innerHTML = periodSelect.value;
     });
     resultInputAll.forEach(function(elem){
            elem.value = '';
     });


     for(let i = 0; i < incomeItems.length; i++){
         if(i>0) {
            incomeItems[i].parentNode.removeChild(incomeItems[i]);
            incomePlus.style.display = 'block';
        }
    }


    for(let i = 0; i < expensesItems.length; i++){
         if(i>0) {
            expensesItems[i].parentNode.removeChild(expensesItems[i]);
            expensesPlus.style.display = 'block';
         }
     }
    start.style.display = 'block';
    cancel.style.display = 'none'; 
    depositPercent.style.display ='none';
    depositBank.style.display ='none';
    depositAmount.style.display ='none';
    expensesPlus.removeAttribute('disabled');
    incomePlus.removeAttribute('disabled');
    depositCheck.checked = false;
    this.budget = 0;
    this.budgetDay = 0;
    this.budgetMonth = 0;
    this.expensesMonth = 0;
    this.income = {};
    this.incomeMonth = 0;
    this.addIncome = [];
    this.expenses = {}; 
    this.addExpenses = [];
    this.deposit = false; 
    this.percentDeposit = 0;
    this.moneyDeposit = 0;
        
};

showResult(){ 
    const _this = this;
    budgetMonthValue.value = this.budgetMonth;
    budgetDayValue.value = this.budgetDay;
    expensesMonthValue.value = this.expensesMonth;
    additionalExpensesValue.value = this.addExpenses.join(', ');
    additionalIncomeValue.value = this.addIncome.join(', ');
    targetMonthValue.value = this.getTargetMonth();
    incomePeriodValue.value = _this.calsSaveMoney();
    periodSelect.addEventListener('input', function() {
        incomePeriodValue.value = _this.calsSaveMoney();
      });
};

addExpensesBlock() {
    let cloneExpensesItem = expensesItems[0].cloneNode(true);
    expensesItems[0].parentNode.insertBefore(cloneExpensesItem, expensesPlus);
    expensesItems = document.querySelectorAll('.expenses-items');
    cloneExpensesItem.firstElementChild.value = '';
    cloneExpensesItem.lastElementChild.value = '';
     if(expensesItems.length === 3) {
        expensesPlus.style.display = 'none';
     }
};

getExpenses() {
    const _this = this;
    expensesItems.forEach(function(item){
          let itemExpenses = item.querySelector('.expenses-title').value;
         let cashExpenses = item.querySelector('.expenses-amount').value;
          if(itemExpenses !== '' && cashExpenses !== ''){
           _this.expenses[itemExpenses] = cashExpenses;
       }
     });
};

addIncomeBlock(){
    let cloneIncomeItem = incomeItems[0].cloneNode(true);
    incomeItems[0].parentNode.insertBefore(cloneIncomeItem, incomePlus);
    cloneIncomeItem.firstElementChild.value = '';
    cloneIncomeItem.lastElementChild.value = '';
    incomeItems = document.querySelectorAll('.income-items');
    if(incomeItems.length === 3){
          incomePlus.style.display = 'none';
    }
};

getIncome(){
    const _this = this;
    incomeItems.forEach(function(item){
           let itemIncome = item.querySelector('.income-title').value;
          let cashIncome = item.querySelector('.income-amount').value;
         if(itemIncome !=='' &&  cashIncome !== ''){
             _this.income[itemIncome] = cashIncome; 
             _this.incomeMonth += +cashIncome;
           
         }
     });
        console.log(_this.incomeMonth);
}; 
    
getAddExpenses(){
    const _this = this;
    let addExpenses = additionalExpensesItem.value.split(',');
    addExpenses.forEach(function(item){
      item = item.trim();
      if (item !== ''){
        _this.addExpenses.push(item);
      }
     });
};

getAddIncome(){
    const _this = this;
    additionalIncomeItem.forEach(function(item){
    let itemValue = item.value.trim();
    if (itemValue !== ''){
      _this.addIncome.push(itemValue);
    }
    });
};
      //Сумма расходов
getExpensesMonth() {
    for (let key in this.expenses) {
        this.expensesMonth += +this.expenses[key];
    }
    console.log('Расходы за месяц ' + this.expensesMonth + ' рублей');
};

      // Бюджет в месяц и день
getBudget() {
    const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
    this.budgetMonth =  this.budget + +this.incomeMonth - this.expensesMonth + monthDeposit;
    this.budgetDay = Math.floor(this.budgetMonth / 30);
};

    // Достижение цели
getTargetMonth() {
    return (Math.ceil(targetAmount.value / this.budgetMonth));
};

     // Уровень дохода
getStatusIncome() {
    if (this.budgetDay > 1200) {
    console.log('У вас высокий уровень дохода');
    } else if (600 < this.budgetDay){ 
    console.log('У вас средний уровень дохода');
    } else if (0 < this.budgetDay) {
        console.log('У вас средний уровень дохода');
    } else if (0 > this.budgetDay) {
        console.log('Что то пошло не так');
    }
};
        
updatePeriod(){
    document.querySelector('.period-amount').textContent = periodSelect.value;
};


calsSaveMoney() {
    return this.budgetMonth * periodSelect.value;
};

// Deposit in bank
etInfoDeposit() {
    if (this.deposit) {
            this.percentDeposit = depositPercent.value; 
            this.moneyDeposit = depositAmount.value;
    }
};

changePercent() {
    const valueSelect = this.value;
    if(valueSelect === 'other') {
        depositPercent.style.display ='inline-block';
        depositPercent.value = '';
    } else {
        depositPercent.value = valueSelect;
        depositPercent.style.display ='none';
        
    }
};

depositHandler() {
    if(depositCheck.checked){
        depositBank.style.display ='inline-block';
        depositAmount.style.display ='inline-block';
        this.deposit = true;
        depositBank.addEventListener('change', this.changePercent);
    } else {
        depositBank.style.display ='none';
        depositAmount.style.display ='none';
        depositBank.value = '';
        depositAmount.value = '';
        this.deposit = false;
        depositBank.removeEventListener('change', this.changePercent);
    }
};

eventListeners() {
    start.addEventListener('click', this.start.bind(this));
    cancel.addEventListener('click', this.reset.bind(this));
    document.addEventListener("input", function(e){
        if( e.target.placeholder === 'Наименование' ){
          let regexp = /[^а-яА-Я\s\,\.]{0,}/g;
          e.target.value = e.target.value.replace( regexp, "" );
        }
    
        if( e.target.placeholder === 'Сумма'){
          let regexp = /[^\d]{0,}/g;
          e.target.value = e.target.value.replace( regexp, "" );
        }
  
        if( e.target === depositPercent){
          if( isNumber( e.target.value ) && ( e.target.value > 0 && e.target.value < 100 ) ){
            start.disabled = false;
          } else {
            alert( "Введите корректное значение в поле проценты" );
            start.disabled = true;
          }
        }
      });
    incomePlus.addEventListener('click', this.addIncomeBlock);
    expensesPlus.addEventListener('click', this.addExpensesBlock);
    periodSelect.addEventListener('input', this.updatePeriod);
    depositCheck.addEventListener('change', this.depositHandler.bind(this));
};  
};
const appData = new AppData();
appData.eventListeners();

console.log(appData);

function isNumber(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
  }  