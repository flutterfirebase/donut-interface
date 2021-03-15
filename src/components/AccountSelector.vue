<template>
  <div class="mask">
    <div class="account-list-box">
      <h3>
          Please select a account for operation.
      </h3>
    <card @click="selectAccount(acc)" v-for="acc in polkadotAccounts" :key="acc">
        <p>
            {{ acc.address }}
        </p>
        <p style="color: var(--secendary-text);font-size:14px;">
          {{ balance(acc) | amountForm }}" DNUT"
        </p>
    </card>
    </div>
  </div>
</template>

<script>
import Card from './ToolsComponents/Card'
import { getAccountBalance } from '../utils/chain/polkadot'
import { mapState, mapActions } from 'vuex'
export default {
  name: "AccountSelector",
  components: {
      Card
  },
  computed: {
      ...mapState(['polkadotAccounts']),
  },
  methods: {
    ...mapActions(['saveDonutAccount']),
    selectAccount(acc){
        this.saveDonutAccount(acc)
    },
    balance(acc){
      return getAccountBalance(acc)
    }
  },
};
</script>

<style lang="scss" scoped>
.account-list-box {
  margin-top: -15%;
  width: 492px;
  background: white;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.05);
  border-radius: 28px;
  padding: 24px;
}
.card{
  margin: 8px 14px;
}
</style>