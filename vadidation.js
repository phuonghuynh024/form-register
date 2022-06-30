function Validator(options) {


    vadidate = (input, rule) => {
        var errorElement = input.parentElement.querySelector('.form-message');
        var errorMessage = rule.isValid(input.value);
        console.log(errorMessage);
        

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
        options.rules.forEach(function (rule) {
            var inputElememt = document.querySelector(rule.selector);
            if (inputElememt) {
                inputElememt.onblur = function () {
                    vadidate(inputElememt,rule);
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
        isValid: function (value) {
            return value.trim() ? undefined : 'Vui Lòng Nhập Trường này'
        },
    } // Here to validation the value
}

Validator.isEmail = (selector) => {
    return {
        selector,
        isEmail: function () {

        },
    }
}

