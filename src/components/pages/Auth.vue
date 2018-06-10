<template>
  <v-container fluid>
    <v-layout row>
      <v-flex md4 offset-md4>
        <h1> &nbsp;</h1>
        <v-card>
          <v-tabs
            v-model="tabs"
            fixed-tabs
            height="40">
            <v-tab href="#log-in">Log In</v-tab>
            <v-tab href="#sign-up">Sign Up</v-tab>
          </v-tabs>
          <v-card-text>
            <v-tabs-items v-model="tabs">
              <v-tab-item :id="'log-in'">
                <form @submit.prevent="onLogIn">
                  <v-layout row>
                    <v-flex xs4>
                      <v-subheader>User ID</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-text-field name="email" v-model="email" label="email" value="Input text" class="input-group--focused"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs4>
                      <v-subheader>Password</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-text-field name="password" v-model="password" label="password" value="Input text" type="password" class="input-group--focused"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-btn class="blue white--text" type="submit">log in</v-btn>
                </form>
              </v-tab-item>

              <v-tab-item :id="'sign-up'">
                <form @submit.prevent="onSignUp" autocomplete="off">
                  <v-layout row>
                    <v-flex xs4>
                      <v-subheader>User ID</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-text-field name="email" v-model="email" label="email" value="Input text" class="input-group--focused"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs4>
                      <v-subheader>Password</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                      <v-text-field name="password" v-model="password" label="password" value="Input text" type="password" class="input-group--focused"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-btn class="blue white--text" type="submit">sign up</v-btn>
                </form>
              </v-tab-item>

            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import { mapMutations, mapState } from 'vuex'

export default {
  data () {
    return {
      email: '',
      password: '',
      tabs: 'log-in'
    }
  },
  computed: {
    ...mapState(['error'])
  },
  watch: {
    error (value) {
      if (value !== null && value !== undefined) {
        this.openSnackbar({
          text: value.message,
          color: 'error'
        })
      }
    }
  },
  methods: {
    ...mapMutations('snackbar', ['showSnackbar', 'closeSnackbar']),
    onLogIn () {
      this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password
      })
    },
    onSignUp () {
      this.$store.dispatch('auth/signUp', {
        email: this.email,
        password: this.password
      })
    },
    onLogout () {
      this.$store.dispatch('auth/logout')
    },
    openSnackbar (payload) {
      this.showSnackbar(payload)
    }
  }
}
</script>
