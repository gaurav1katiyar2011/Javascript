  //Budget Controller
  var budgetController= (function (){
    var Expense = function (id, value, description){
      this.id= id;
      this.value= value;
      this.description= description
    };
    var Income = function (id, value, description){
      this.id= id;
      this.value= value;
      this.description= description
    };
    var data= {
      allItems:{
        inc:[],
        exp:[]
      },
      totals:{
        inc:0,
        exp:0
      },
      budget:0,
      percentage:-1
    };
    
    var calcualteTotal = function (type){
      var sum=0;
      data.allItems[type].forEach(function (cur){
        sum= sum+cur.value;
      })
      data.totals[type]=sum;
    }
  
    return{
      addItem: function (type,value,desc){
        var newItem,ID;
        if (data.allItems[type].length>0){
          ID= data.allItems[type][data.allItems[type].length-1].id+1;
        }else {
          ID=0;
        }
        if (type==='inc'){
            newItem= new Income(ID,value,desc);
        }else if(type==='exp'){
            newItem = new Expense(ID,value,desc);
        }
        data.allItems[type].push(newItem);
        return newItem;
      },
      calculateBudget: function (){

          calcualteTotal('inc');
          calcualteTotal('exp');
          data.budget= data.totals.inc-data.totals.exp;
          data.percentage = Math.ceil(data.totals.inc==0?0:(data.totals.exp/data.totals.inc)*100);
      },
      getBudget: function (){
        return {
          budget: data.budget,
          totalInc: data.totals.inc,
          totalExp: data.totals.exp,
          percentage: data.percentage
        }
      },
      testing: function(){
        console.log(data);
      }
    } 

  })();
  // UI controller 
  var UIController = (function(){
    var DOMStrings={
     inputType:".add__type",
     inputDescription: ".add__description",
     inputValue:".add__value",
     inputBtn:".add__btn",
     expenseContainer:".expenses__list",
     incomeContainer:".income__list",
     budgetValue: ".budget__value",
     budgetInc: ".budget__income--value",
     budgetExp: ".budget__expenses--value",
     budgetPer:".budget__expenses--percentage"
    }
     return {
       getInput: function (){
        return {
         type: document.querySelector(DOMStrings.inputType).value,
         description: document.querySelector(DOMStrings.inputDescription).value,
         value: parseFloat(document.querySelector(DOMStrings.inputValue).value) 
        }
      },
      addListItem:  function (obj,type){
        var html,newHTML,element;


        if (type==='inc'){
          element= DOMStrings.incomeContainer;
          html='<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }else if (type==='exp'){
          element = DOMStrings.expenseContainer;
          html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }
        console.log(obj);
        newHTML = html.replace('%id%',obj.id);
        newHTML = newHTML.replace('%description%',obj.description);
        newHTML = newHTML.replace('%value%',obj.value);
        document.querySelector(element).insertAdjacentHTML('beforeend',newHTML)

      },

      clearFields : function(){
        var fields = document.querySelectorAll(DOMStrings.inputDescription+","+DOMStrings.inputValue);

        var fieldArr = Array.prototype.slice.call(fields);
        console.log(fieldArr)
        fieldArr.forEach(function (current,index){
          current.value="";
        });
        fieldArr[0].focus();

      }, 
      displayBudget : function (obj){
        document.querySelector(DOMStrings.budgetValue).textContent=obj.budget;
        document.querySelector(DOMStrings.budgetInc).textContent=obj.totalInc;
        document.querySelector(DOMStrings.budgetExp).textContent=obj.totalExp;
        if (obj.percentage>0){
          document.querySelector(DOMStrings.budgetPer).textContent=obj.percentage+"%";  
        }else {
          document.querySelector(DOMStrings.budgetPer).textContent="---";
        }
        

      },
      getDOMString: function (){
       return DOMStrings;
      }
     }

  })();

  // App Controller
  var controller = (function(budgetCtrl, UICtrl){
   function setupEventListner(){
    var DOM= UICtrl.getDOMString();
    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);

    document.addEventListener('keypress',function(e){
     if (e.keyCode==13){
      ctrlAddItem();
     }
    }) 
   }
   var updateBudget= function (){
      budgetCtrl.calculateBudget();
      var budget= budgetCtrl.getBudget();
      UICtrl.displayBudget(budget);
      
   }
   var ctrlAddItem= function (){
    var input= UICtrl.getInput();
    console.log(input);
    if (input.description!=="" && !isNaN(input.value) && input.value>0 ){

      //2. Add the item to budget controller
      var newItem= budgetCtrl.addItem(input.type, input.value, input.description);
      //3. Add the item to UI
      UICtrl.addListItem(newItem,input.type);
      //4 clear fields

      UICtrl.clearFields();
      var budget= updateBudget();
      
    }
    //4. Calculate the budget
     
    //5. Display the budget on UI

     
   }
   return {
    init: function (){
      setupEventListner();
      UICtrl.displayBudget({totalInc:0,totalExp:0,percentage:-1,budget:0});
     console.log("Application started");
     
    }
   }
  })(budgetController,UIController);
  controller.init();