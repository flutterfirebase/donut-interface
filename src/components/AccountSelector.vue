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
          <p class="name">
            {{ acc.meta.name }}
          </p>
          <p class="address">
            {{ acc.address }}
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
  padding: 10px 18px;
  min-width: 600px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-content: center;
  p{
    margin: 0; 
  }
  .name{
    font-size: 14px;
    color: var(--primary-text);
  }
  .address{
    font-size: 14px;
    color: var(--secondary-text);
  }
}
.acc:hover {
  cursor: pointer;
  border: 1px solid rgba(217, 219, 222, 0.8);
}
</style>