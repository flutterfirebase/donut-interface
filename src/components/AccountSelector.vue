<template>
  <div class="mask">
    <div class="account-list-box">
      <h5>Please select a account for operation.</h5>
      <div class="list-container">
        <div
          class="acc"
          @click="selectAccount(acc)"
          v-for="acc in polkadotAccounts"
          :key="acc.address"
        >
          <p>
            {{ acc.address }}
          </p>
          <p style="color: var(--secondary-text); font-size: 14px;margin-top:4px;text-align:right;">
            {{ acc.balance | amountForm }} DNUT
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAccountBalance } from "../utils/chain/polkadot";
import { mapState, mapActions } from "vuex";
export default {
  name: "AccountSelector",
  computed: {
    ...mapState(["polkadotAccounts", "api"]),
  },
  methods: {
    ...mapActions(["saveDonutAccount"]),
    selectAccount(acc) {
      this.saveDonutAccount(acc);
    },
  },
  async mounted () {
    let that = this
    this.polkadotAccounts.forEach(async (acc) => {
      acc.balance = await getAccountBalance(acc, that.api)
    });
  },
};
</script>

<style lang="scss" scoped>
.account-list-box {
  margin-top: -15%;
  min-width: 492px;
  background: white;
  box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.05);
  border-radius: 28px;
  padding: 24px;
  h5 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  .list-container {
    max-height: 50%;
    overflow: scroll;
  }
}
.acc {
  margin: 8px 10px;
  padding: 18px 24px;
  box-sizing: border-box;

  background: white;
  box-shadow: 0px 2px 20px 0px rgba(0, 0, 0, 0.02);
  border-radius: 28px;
  border: 1px solid rgba(227, 229, 232, 0.5);
  p{
    margin: 0; 
  }
}
.acc:hover {
  cursor: pointer;
  border: 1px solid rgba(217, 219, 222, 0.8);
}
</style>