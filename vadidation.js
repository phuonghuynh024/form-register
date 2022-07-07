function Validator(options) {

    var selectorRule = {}

    getParent = (element, selector) => {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    vadidate = (input, rule) => {

        var errorElement = getParent(input, options.formGroup).querySelector(options.errorMessage);
        //var errorMessage = rule.test(input.value);
        var errorMessage
        var rules = selectorRule[rule.selector]



        for (var i = 0; i < rules.length; i++) {
            switch (input.type) {
                case "checkbox":
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
                    break
                case "radio":
                    errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'))
                    break
                default:
                    errorMessage = rules[i](input.value);
            }
            if (errorMessage) break;
        }


        if (errorMessage) {
            input.value = '';
            errorElement.innerText = errorMessage;
            getParent(input, options.formGroup).classList.add('invalid');
            isFormValid = false
        } else {
            errorElement.innerText = '';
            getParent(input, options.formGroup).classList.remove('invalid');
        }

        return !!errorMessage;
    };


    var formElement = document.querySelector(options.form);


    if (formElement) {

        formElement.onsubmit = function (e) {

            e.preventDefault();

            var data = {}
            var isFormValid = true


            options.rules.forEach(function (rule) {

                var inputElememts = document.querySelectorAll(rule.selector);


                Array.from(inputElememts).forEach(function (inputElememt) {
                    var result = []
                    switch(inputElememt.type){
                        case "checkbox":
                            
                            if (!inputElememt.matches(':checked')) return null
                            if(!Array.isArray(data[inputElememt.name])){
                                data[inputElememt.name] = [inputElememt.value]
                            }else{
                                console.log('aaa');
                                data[inputElememt.name].push(inputElememt.value)
                            }
                            break
                        case "radio":
                            if(inputElememt.matches(':checked')){
                                data[inputElememt.name] = inputElememt.value
                            }
                            break;
                        default:
                            data[inputElememt.name] = inputElememt.value;
                    }
                    
                    var isValid = vadidate(inputElememt, rule)
                    if (isValid) {
                        isFormValid = false
                    }
                })




            })

            if (isFormValid) {
                options.onSubmit(data)
            }
        }

        /** Bởi vì dùng vòng lặp, lặp qua các rule nên nếu nhiều rule cùng control 1 input
         * thỳ rule cuối cùng, sẽ đc thực hiện
         * 
         */

        options.rules.forEach(function (rule) {

            /** Idea to fix nhiều control một field
             * Tạo Array chứa tất cả các control
             */

            if (Array.isArray(selectorRule[rule.selector])) {
                selectorRule[rule.selector].push(rule.test)
            } else {
                selectorRule[rule.selector] = [rule.test]
            }


            var inputElememt = document.querySelector(rule.selector);
            if (inputElememt) {
                inputElememt.onblur = function () {
                    vadidate(inputElememt, rule);
                }
                inputElememt.oninput = function () {
                    var errorElement = getParent(inputElememt, options.formGroup).querySelector(options.errorMessage);
                    errorElement.innerText = '';
                    getParent(inputElememt, options.formGroup).classList.remove('invalid');
                }
            }

        });
    }


}


/*
    1. Nếu có lỗi => Message lỗi
    2. Nếu không có lỗi => undefined
*/
Validator.isRequired = (selector, message) => {
    return {
        selector,
        test: function (value) {
            return value ? undefined : message || 'Vui Lòng Nhập Trường này'
        },
    } // Here to validation the value
}

Validator.isEmail = (selector, message) => {
    return {
        selector,
        test: function (value) {
            var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return value.match(validRegex) ? undefined : message || 'Vui Lòng Nhập Email'

        },
    }
}

Validator.isPassword = (selector, min, message) => {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : message || 'Vui Lòng Nhập Lớn Hơn 6 Kí Tự'
        },
    }
}

Validator.password_confirmation = (selector, confirm, message) => {
    return {
        selector,
        test: function (value) {
            if (confirm()) {
                return value == confirm() ? undefined : message || 'Vui Lòng Nhập Trùng Password'
            } else {
                return 'Vui Lòng Nhập Password Trước'
            }
        }
    }
}





