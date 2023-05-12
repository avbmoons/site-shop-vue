//  задаем адрес сервера с API
const API_URL = 'http://127.0.0.1:3000/'

//  Формируем компоненты (шаблоны)

//  шаблон поиска
Vue.component('search', {
    template: `<div class="search-box">
    <input type="text" class="goods-search" v-model="searchLine">
    <button class="search-button" type="button" v-on:click="onClick">Найти</button>
</div>`,
    data() {
        return {
            searchLine: ''
        }
    },
    methods: {
        onClick() {
            this.$emit('search', this.searchLine);
        }
    },

})

//  шаблон карточки товара в каталоге
Vue.component('goods-item', {
    template: `<div class="goods-item">
    <h3 class="h3-item" v-on:click="onClick()">{{ title }}</h3>
    <p class="p-item">$ {{ price }}</p>
</div>`,
    props: {
        id_product: Number,
        title: String,
        price: Number,
    },
    methods: {
        onClick() {
            fetch(API_URL + "addToCart", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/JSON'
                },
                body: JSON.stringify({ id_product:this.id_product, product_name: this.title, price: this.price })
              })
              .then(()=>{
                  this.$root.loadCart();
              })
        }
    },
})

//  шаблон списка товаров каталога
Vue.component('goods-list', {
    template: `<div class="goods-list">
    <goods-item
    v-for="good of list"
    v-bind:value="good.id_product"
    v-bind:title="good.product_name"
    v-bind:price="good.price"
    v-on:add="onAdd(good)"
    ></goods-item>
    </div>`,
    props: {
        list: Array
    },
    methods: {
        onAdd(good) {
            this.$emit('add', good)
        }
    },
})

//  шаблон карточки товара в корзине
Vue.component('cart-item', {
    template: `<div class="goods-item">
        <div class="item-content">
            <h3 class="h3-item">{{ good.product_name }}</h3>
            <p class="p-item">$ {{ good.price }}</p>            
        </div>
        <button v-on:click="onRemove" class="remove-btn">X</button>
    </div>`,
    props: {
        good: Object
    },
    methods: {
        onRemove() {
            fetch(API_URL + "removeFromCart", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/JSON'
                },
                body: JSON.stringify({ id_product:this.id_product,product_name: this.title, price: this.price })
              })
              .then(()=>{
                this.$root.loadCart();
            })
        }
    }
})

//  шаблон корзины
Vue.component('cart', {
    template: `<div class="cart-box">
    <div class="cart-head-box">
    <h3 class="cart-head">Корзина</h3>
    <span class="close-btn" v-on:click="onClose">X</span>
    </div>
    <div class="goods-list">
    <cart-item 
    v-for="good of cart"
    v-bind:value="good.id_product" 
    v-bind:good="good" 
    v-on:remove="onRemove">
    </cart-item></div></div>`,
    props: {
        cart: Array
    },
    methods: {
        onClose() {
            this.$emit('close')
        },
        onRemove(good) {
            this.$emit('remove', good)
        }      
    }
})

new Vue({
    el: "#app",
    data: {
        goods: [],
        filteredGoods: [],
        cart: [],
        isVisibleCart: false
    },
    methods: {
        loadGoods() {
            fetch(`${API_URL}catalogData`)
                .then((request) => request.json())
                .then((data) => {
                    this.goods = data;
                    this.filteredGoods = data;
                })
        },
        loadCart() {
            fetch(`${API_URL}cart`)
                .then((request) => request.json())
                .then((data) => {
                    this.cart = data;
                })
        },
        addToCart(good) {
            fetch(`${API_URL}addToCart`, {method:'post'})
                .then(() => {
                    this.cart.push(good)
                })
                .then(() => {
                    this.loadCart()
                })
        },
        removeFromCart(good) {
            fetch(`${API_URL}removeFromCart`,{method:'post'})
                .then(() => {
                    const index = this.cart.findIndex((item) => item.id_product === good.id_product)
                    this.cart.splice(index, 1)
                })
                .then(() => {
                    this.loadCart()
                })
        },
        onSearch(searchLine) {
            const reg = new RegExp(searchLine, 'i')
            this.filteredGoods = this.goods.filter((good) => reg.test(good.product_name))
        },
        onToggleCart() {
            this.isVisibleCart = !this.isVisibleCart
        }
    },
    mounted() {
        this.loadGoods();
        this.loadCart();
    },
});

const form = document.getElementById('form');
const name = document.getElementById('nname');
const phone = document.getElementById('pphone');
const email = document.getElementById('eemail');
const eerror = document.getElementById('eerror');

//кнопка для отображения формы отправки сообщения

function onMailForm() {
    let mailForm = document.getElementById('mail-form');
    mailForm.style.display = 'block';
}

//  проверка и отправка формы связи

function sendError(input, text) {
    input.style.border = '1px solid red'
    eerror.textContent = text
}

function clear() {
    const inputs = form.querySelectorAll('input')

    inputs.forEach((input) => {
        input.style.border = 'inherit'
    })

}

function checkName() {
    const regexp = /^[a-zA-Zа-яА-Я]+$/
    if (!regexp.test(nname.value.trim())) {
        sendError(nname, 'Имя может содержать только буквы')
    }
}

function checkPhone() {
    console.log(2)
    const regexp = /^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{4}$/
    if (!regexp.test(pphone.value)) {
        sendError(pphone, 'Телефон должен иметь формат +7(000)000-0000')
    }
}

function checkEmail() {
    const regexp = /^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/
    console.log(eemail.value)
    if (!regexp.test(email.value.trim())) {
        sendError(eemail, 'Недействительный адрес эл-почты')
    }
}

function onSubmit(e) {
    clear();
    checkName() || e.preventDefault();
    checkPhone() || e.preventDefault();
    checkEmail() || e.preventDefault();

    this.disabled = false;
};

form.addEventListener('submit', onSubmit);

//  очистка формы
function onReset(e) {
    form.clear = true;
    let errorText = document.getElementById('eerror');
    errorText.textContent = '';
    clear();
    let submitBtn = document.getElementById('submit');
    submitBtn.disabled = false;
    submitBtn.style.border = '1px solid grey';

};


