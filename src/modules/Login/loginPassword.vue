<!-- eslint-disable -->
<template>
    <div class="bfe-login">
        <div class="bfe-login-hearder">
            <img :src="logo" alt class="img"/>
        </div>
        <div class="login-wrap">
            <div class="title" >{{ $t('login.userLogin') }}</div>
            <Form
                ref="formData"
                :model="formData"
                :rules="ruleInline"
            >
                <FormItem prop="user" class="user_title">
                    <Input
                        v-model="formData.user"
                        type="text"
                        :placeholder="$t('com.tipEnterX', {obj: $t('com.userName')})"
                        size="large"
                    >
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="password">
                    <Input
                        v-model="formData.password"
                        type="password"
                        :placeholder="$t('com.tipEnterX', {obj: $t('com.password')})"
                        size="large"
                    >
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </Input>
                </FormItem>
                <FormItem prop="code">
                    <Input
                        v-model="formData.code"
                        :placeholder="$t('login.verificationCode')"
                        size="large"
                        class="change-input-style code-input-style"
                    ></Input>
                    <canvas id="canvas" class="code"></canvas>
                    <span class="switchCode" @click="showNum">{{ $t('login.changeOne') }}</span>
                </FormItem>
                <FormItem>
                    <Button
                        v-preventReClick
                        type="primary"
                        class="user_login_btn"
                        @click="handleSubmit('formData')"
                    >{{ $t('login.name') }}</Button>
                </FormItem>
            </Form>
        </div>
        <footer class="version">
           {{ $t('com.currentVersion') }} V{{ Version }}
        </footer>
    </div>
</template>
<script>
export default {
    name: 'loginpassword',
    mounted() {
        this.draw(this.num);
        this.code = this.num.join().replace(/,/g, '');

        let meta = this.$store.getMeta();
        if (meta && meta.logo) {
            this.logo = meta.logo;
        }
    },
    data() {
        const validateCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.$t('com.tipEnterX', {obj: this.$t('login.verificationCode')})));
                return;
            }
            if (value.toLowerCase() !== this.code.toLowerCase()) {
                callback(new Error(this.$t('login.tipCodeError')));
                return;
            }
            callback();
        };
        return {
            autoCode: '',
            num: [],
            formData: {
                user: '',
                password: '',
                code: ''
            },
            code: '',
            ruleInline: {
                user: [{required: true, message: this.$t('com.tipEnterX', {obj: this.$t('com.userName')}),
                trigger: 'blur'}],
                password: [{required: true, message: this.$t('com.tipEnterX', {obj: this.$t('com.password')}),
                trigger: 'blur'}],
                code: [{required: true, validator: validateCode, trigger: 'blur'}]
            },
            logo: require('@/assets/img/logo.png')
        };
    },
    methods: {
        goLogin(data) {
            this.$store.setUserData(data);
            let home = 'product.list';
            let name = null;
            let role = this.$ProductRole;
            if (data.is_admin) {
                home = 'product.home';
                name = 'BFE';
                role = this.$AdminRole;
            }
            this.$router.push({name: home, params: {name}, query: {role}});
        },
        handleSubmit(name) {
            this.$refs[name].validate(valid => {
                if (valid) {
                    const body = {
                        user_name: this.formData.user,
                        password: this.formData.password
                    };
                    this.$request({
                        url: 'auth/session-keys',
                        method: 'post',
                        data: body,
                        withoutAuth: true
                    }).then(data => {
                        if (data.status === 200) {
                            this.goLogin(data.data.Data);
                        }
                    });
                }
                else {
                    this.$Message.error({
                        content: this.$t('com.tipValidateError')
                    });
                }
            });
        },
        showNum() {
            this.draw(this.num);
            this.code = this.num.join().replace(/,/g, '');
        },
        draw(num) {
            let canvas_width = 138;
            let canvas_height = 35;
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');
            canvas.width = canvas_width;
            canvas.height = canvas_height;

            let sCode = 'A,B,C,D,E,F,G,H,J,K,M,N,P,Q,R,S,T,U,V,W,X,Y,Z,2,3,4,5,6,7,8,9';
            let aCode = sCode.split(',');
            let aLength = aCode.length;
            for (let i = 0; i <= 3; i++) {
                let j = Math.floor(Math.random() * aLength);
                let deg = (Math.random() * 15 * Math.PI) / 180;
                let txt = aCode[j];
                num[i] = txt;
                let x = 20 + i * 30;
                let y = 20 + Math.random() * 8;
                context.font = 'bold 23px 微软雅黑';
                context.translate(x, y);
                context.rotate(deg);
                context.fillStyle = this.randomColor();
                context.fillText(txt, 0, 0);
                context.rotate(-deg);
                context.translate(-x, -y);
            }
            for (let i = 0; i <= 5; i++) {
                context.strokeStyle = this.randomColor();
                context.beginPath();
                context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
                context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
                context.stroke();
            }
            for (let i = 0; i <= 30; i++) {
                context.strokeStyle = this.randomColor();
                context.beginPath();
                let x = Math.random() * canvas_width;
                let y = Math.random() * canvas_height;
                context.moveTo(x, y);
                context.lineTo(x + 1, y + 1);
                context.stroke();
            }
        },
        randomColor() {
            let r = Math.floor(Math.random() * 256);
            let g = Math.floor(Math.random() * 256);
            let b = Math.floor(Math.random() * 256);
            return 'rgb(' + r + ',' + g + ',' + b + ')';
        }
    }
};
</script>
