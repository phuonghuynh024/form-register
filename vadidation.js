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
            switch (input.type) {
                case "checkbox":
                case "radio":
                    break
                default:
                    input.value = '';
            }
            errorElement.innerText = errorMessage;
            getParent(input, options.formGroup).classList.add('invalid')
        } else {
            errorElement.innerText = '';
            getParent(input, options.formGroup).classList.remove('invalid');
        }
        return !errorMessage
    };


    var formElement = document.querySelector(options.form);


    if (formElement) {

        formElement.onsubmit = function (e) {

            e.preventDefault();

            var data = {} 

            var isFormValid = true;

            options.rules.forEach(function (rule) {

                var inputElememts = document.querySelectorAll(rule.selector);
                Array.from(inputElememts).forEach(function (inputElememt) {
                    switch(inputElememt.type){
                        case "checkbox":
                            if (!inputElememt.matches(':checked')) break
                            if(!Array.isArray(data[inputElememt.name])){
                                data[inputElememt.name] = [inputElememt.value]
                            }else{
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

                    if(!isValid){
                        isFormValid = false
                    }
                })
            })

            if (isFormValid) {
                options.onSubmit(data)
            }
        }

        /** B???i v?? d??ng v??ng l???p, l???p qua c??c rule n??n n???u nhi???u rule c??ng control 1 input
         * th??? rule cu???i c??ng, s??? ??c th???c hi???n
         * 
         */

        options.rules.forEach(function (rule) {

            /** Idea to fix nhi???u control m???t field
             * T???o Array ch???a t???t c??? c??c control
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
    1. N???u c?? l???i => Message l???i
    2. N???u kh??ng c?? l???i => undefined
*/
Validator.isRequired = (selector, message) => {
    return {
        selector,
        test: function (value) {
            return value ? undefined : message || 'Vui L??ng Nh???p Tr?????ng n??y'
        },
    } // Here to validation the value
}

Validator.isEmail = (selector, message) => {
    return {
        selector,
        test: function (value) {
            var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return value.match(validRegex) ? undefined : message || 'Vui L??ng Nh???p Email'

        },
    }
}

Validator.isPassword = (selector, min, message) => {
    return {
        selector,
        test: function (value) {
            return value.length >= min ? undefined : message || 'Vui L??ng Nh???p L???n H??n 6 K?? T???'
        },
    }
}

Validator.password_confirmation = (selector, confirm, message) => {
    return {
        selector,
        test: function (value) {
            if (confirm()) {
                return value == confirm() ? undefined : message || 'Vui L??ng Nh???p Tr??ng Password'
            } else {
                return 'Vui L??ng Nh???p Password Tr?????c'
            }
        }
    }
}





