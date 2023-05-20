export function calculator_function(backend){

    const calculator = document.querySelector('.calculator');
    const display = document.querySelector('.calculator__display');
    const keys = calculator.querySelector('.calculator__keys');
    const loader = document.querySelector('.loader');

    backend.reset();
    
  keys.addEventListener('click', e => {
    const key = e.target;
    const action = key.dataset.action;
    
    if (!key.matches('button')) return;
    
    if(!action) showNumber(key);
    if(action) operations(action);
    
  });

  const operations=async(action)=>{  
    
    if (action === 'decimal') {
      display.textContent = display.textContent + '.';
      return;
    }
    
    if(action ==='clear'){
      calculator.dataset.firstValue=undefined;
      calculator.dataset.secondValue=undefined;
      calculator.dataset.operator='';
      calculator.dataset.previousKeyType='';
      display.textContent='0';
      backend.reset();
      return;
    }
    
    // operators ---------------
    const operators = ['add','substract','multiply','divide'];
    if(operators.includes(action) || action==='calculate'){

      if(operators.includes(action)){
        calculator.dataset.operator=action;
      }
      
      // calculate ----------------
      let firstValue = calculator.dataset.firstValue;
      const operator = calculator.dataset.operator;
      let secondValue = display.textContent;
      let previousKeyType = calculator.dataset.previousKeyType;
      // console.log(`${firstValue} ${operator} ${secondValue} ${previousKeyType}`);

      if ((typeof firstValue!='undefined') && operator && previousKeyType !== 'operator') {
        calculate(firstValue, operator, secondValue)
          .then(
            function(value){
              display.textContent = value;
              if(action!='calculate'){
                calculator.dataset.firstValue = value;
              }
              calculator.dataset.previousKeyType = 'operator';
            },
            function(error){console.error(`Has an error with canister: ${error}`);}
          );

      }else{
        if(!calculator.dataset.firstValue){
          let value1 = display.textContent;
          calculator.dataset.firstValue  = value1;
          calculate(0,'add',value1);
        }
      }
      calculator.dataset.previousKeyType = 'operator';
      // end calculate -----------

    }
    // end operators -----------
    
  }

  const calculate=async (n1, operator, n2)=>{

    loader.style.visibility='visible';

    let result = 0;
    let value2 = parseFloat(n2);
    
    switch(operator){
      case 'add': result = await backend.add(value2); break;
      case 'substract': result = await backend.sub(value2); break;
      case 'multiply': result = await backend.mul(value2); break;
      case 'divide': result = await backend.div(value2); break;
    }

    loader.style.visibility='hidden';

    return result;
  }

  const showNumber=(key)=>{
    const keyContent = key.textContent;
    const previousKeyType = calculator.dataset.previousKeyType;
    calculator.dataset.previousKeyType = 'number';
    
    if (display.textContent === '0') {
        display.textContent = keyContent;
        return;
    }

    if (previousKeyType!='number'){
      display.textContent = '';
    }
    
    display.textContent += keyContent;
    display.textContent = parseFloat(display.textContent);
    
  }

};
