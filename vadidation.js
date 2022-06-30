function Validator(options) {

    var selectorRule = {}

    vadidate = (input, rule) => {

        var errorElement = input.parentElement.querySelector(options.errorMessage);
        //var errorMessage = rule.test(input.value);
        var errorMessage
        var rules = selectorRule[rule.selector]

        for(var i = 0; i < rules.length; i++){
            errorMessage = rules[i](input.value);
            if(errorMessage) break;
        }


        if (errorMessage) {
            errorElement.innerText = errorMessage;
            input.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            input.parentElement.classList.remove('invalid');
        }
    };


    var formElement = document.querySelector(options.form);


    if (formElement) {

        /** Bởi vì dùng vòng lặp, lặp qua các rule nên nếu nhiều rule cùng control 1 input
         * thỳ rule cuối cùng, sẽ đc thực hiện
         * 
         */

        options.rules.forEach(function (rule) {

            /** Idea to fix nhiều control một field
             * Tạo Array chứa tất cả các control
             */

             if(Array.isArray(selectorRule[rule.selector])){
                selectorRule[rule.selector].push(rule.test)
             }else{
                selectorRule[rule.selector] = [rule.test]
             }


            var inputElememt = document.querySelector(rule.selector);
            if (inputElememt) {
                inputElememt.onblur = function () {
                    vadidate(inputElememt, rule); 
                }
                inputElememt.oninput = function () {
                    var errorElement = inputElememt.parentElement.querySelector(options.errorMessage);
                    errorElement.innerText = '';
                    inputElememt.parentElement.classList.remove('invalid');
                }
            }

        });
    }


}


/*
    1. Nếu có lỗi => Message lỗi
    2. Nếu không có lỗi => undefined
*/
Validator.isRequired = (selector) => {
    return {
        selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui Lòng Nhập Trường này'
        },
    } // Here to validation the value
}

Validator.isEmail = (selector) => {
    return {
        selector,
        test: function (value) {
            var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return value.match(validRegex) ? undefined : 'Vui Lòng Nhập Email'

        },
    }
}

Validator.isPassword = (selector, min) => {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : 'Vui Lòng Nhập Lớn Hơn 6 Kí Tự'
        },
    }
}

Validator.password_confirmation = (selector, confirm) =>{
    return{
        selector,
        test: function(value){
            return value == confirm() ? undefined : 'Vui Lòng Nhập Trùng Password'
        }
    }
}