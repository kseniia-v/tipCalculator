function Calculator(options){
  this.$el = options.element;

  this.$form = this.$el.querySelector('[data-selector="form"]');
  this.$ifsplit = this.$el.querySelector('[data-selector="ifsplit"]');
  this.$calc = this.$el.querySelector('[data-selector="calculate"]');

  this.$calc.addEventListener('click', this.processCalc.bind(this));
  this.$ifsplit.addEventListener('change', this.addSplitOption.bind(this));
}

Calculator.prototype.addSplitOption = function(event){
  this.$split = this.$el.querySelector('div[id="split"]');
  this.$between = this.$el.querySelector('span[id="between"]');

  if(event.target.checked){
    let span, label, input;

    if(this.$between){
      return;
    }

    span = document.createElement('span');
    span.id = 'between';

    label = document.createElement('label');
    label.textContent = 'Between';

    input = document.createElement('input');
    input.name = "split";
    input.type = "number";
    input.value = 2;

    span.appendChild(label);
    span.appendChild(input);

    this.$split.insertAdjacentElement('beforeend', span);
  }else{
    this.$split.removeChild(this.$between);
  }
}

Calculator.prototype.processCalc = function(event){
  let result, total, tip;

  let vals = {
    'Total Bill': null,
    'Tip Amount': null,
  }

  event.preventDefault();

  this.$bill = this.$el.querySelector('[data-selector="bill"]');
  this.$tipPerc = this.$el.querySelector('[data-selector="perc"]');
  this.$result = this.$el.querySelector('div[id="result"]');

  if(this.$result){
    this.$el.removeChild(this.$result);
  }

  total = (this.$bill.value * (1 + this.$tipPerc.value / 100)).toFixed(2);
  vals['Total Bill'] = total;

  tip = (this.$bill.value * this.$tipPerc.value / 100).toFixed(2);
  vals['Tip Amount'] = tip;

  result = document.createElement('div');
  result.id = "result";
  result.className = "totals";
  this._render(result,vals);

  if(this.$ifsplit.checked){
    this.$split = this.$el.querySelector('input[name="split"]');
    let persons = this.$split.value;
    pperson=this._calculateSplit(persons,total,tip,vals);
    result.appendChild(pperson);
  }

  let msg = this._note(tip);
  if (msg){
    note = document.createElement('p');
    note.textContent = msg;
    result.appendChild(note);
  }

  this.$el.appendChild(result);

}

Calculator.prototype._calculateSplit = function(persons,bill,tip,args){
    let billPerPerson = (bill / persons).toFixed(2);
    let tipPerPerson = (tip / persons).toFixed(2);

    let pperson = document.createElement('div');
    pperson.id = "perperson";

    let p = document.createElement('p');
    p.textContent = 'Per Person';

    args['Total Bill'] = billPerPerson;
    args['Tip Amount'] = tipPerPerson;

    pperson.appendChild(p);
    this._render(pperson,args);

    return pperson;
}

Calculator.prototype._render = function(elem,args){
  let l, j = 0;
  l = 2 * Object.keys(args).length;
  for (let i = 0; i < l; i++){
    if(i % 2 == 0){
      var text = Object.keys(args)[i/2];
    }else{
      j++;
      var text = Object.values(args)[i-j];
    }

    if (text || text === 0){
      let div = document.createElement('div');
      div.textContent = text;
      elem.appendChild(div);
    }else{
      elem.removeChild(elem.lastChild);
    }
  }
}

Calculator.prototype._note = function(value){
  let note = '';
  if(value >= 15 && value < 20){
    note = 'Nice tips, thanks!';
  }
  if(value >= 20 && value < 30){
    note = 'You\'re quite generous!';
  }
  if(value >= 30 && value < 40){
    note = 'One more bottle of beer to this awesome guy!';
  }
  if(value >= 40 && value < 50){
    note = 'You can eat here for free next time!';
  }
  if(value >= 50){
    note = 'Oh no, we cannot afford it, but if you insist...';
  }
  if(value < 10 && value > 0){
    note = 'OK, all can have their ups and downs...';
  }
  if(value == 0){
    note = 'Have never seen such a mean person before!';
  }
  return note;
}
