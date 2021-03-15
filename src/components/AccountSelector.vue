<template>
  <div class="mask">
    <div class="account-list-box">
      <h3>
          Please select a account for operation.
      </h3>
    <card v-for="acc in polkadotAccounts" :key="acc">
        <p>
            acc.address
        </p>
    </card>
    </div>
  </div>
</template>

<script>
import { web3FromSource } from "@polkadot/extension-dapp";
import Card from './ToolsComponents/Card'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: "AccountSelector",
  components: {
      Card
  },
  computed: {
      ...mapState(['donutAccount','polkadotAccounts']),
  },
  methods: {
      ...mapMutations(['saveDonutAccount']),
    ...mapActions(['saveDonutAccount'])
  },
};
</script>

<style lang="scss" scoped>
.account-list-box {
  margin-top: -15%;
  width: 492px;
  min-height: 252px;
  background: white;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.05);
  border-radius: 28px;
  padding: 24px;
}
</style>