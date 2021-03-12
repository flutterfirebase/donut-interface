<template>
  <div class="swap-field">
    <div class="box">
      <div class="title-box">
        <p class="title">
          <span>{{ this.fromSteemToDonut ? "STEEM" : "DONUT" }}</span>
          <img
            style="margin: 0 8px 4px 8px"
            src="../static/images/left-arrow.svg"
            alt=""
          />
          <span>{{ this.fromSteemToDonut ? "DONUT" : "STEEM" }}</span>
        </p>
      </div>
    </div>
    <div class="line"></div>
    <div class="round-box">
      <div class="box-title-container">
        <span>from</span>
        <span>{{ $t("message.balance") + ": " + fromTokenBalance }} </span>
      </div>
      <div class="box-content-container">
        <input
          class="mb-2 mr-sm-2 mb-sm-0 user input"
          placeholder="0.0"
          v-model="transValue"
          @keyup="checkTransValue"
          inputmode="decimal"
          pattern="^[0-9]*[.,]?[0-9]*$"
          spellcheck="false"
          value
        />
        <div class="token-box">
          <button class="maxBtn" @click="fillMaxTrans">Max</button>
          <img
            class="coin-icon"
            src="../static/images/tokens/steem.png"
            alt=""
            v-if="fromSteemToDonut"
          />
          <img
            class="coin-icon"
            src="../static/images/tokens/donut.svg"
            alt=""
            v-else
          />
          <span>
            {{ fromSteemToDonut ? "STEEM" : "DONUT" }}
          </span>
        </div>
      </div>
    </div>

      <div class="icon-box">
        <span
        @click="changeTransOrder"
          class="exchange-icon"
        />
      </div>
      
    <div class="round-box">
      <div class="box-title-container">
        <span>to</span>
        <span>{{ $t("message.balance") + ": " + toTokenBalance }} </span>
      </div>
      <div class="box-content-container">
        <input
          class="mb-2 mr-sm-2 mb-sm-0 user input"
          placeholder="0.0"
          v-model="transValue"
          @keyup="checkTransValue"
          inputmode="decimal"
          pattern="^[0-9]*[.,]?[0-9]*$"
          spellcheck="false"
          value
        />
        <div class="token-box">
          <img
            class="coin-icon"
            src="../static/images/tokens/donut.svg"
            alt=""
            v-if="fromSteemToDonut"
          />
          <img
            class="coin-icon"
            src="../static/images/tokens/steem.png"
            alt=""
            v-else
          />
          <span>
            {{ fromSteemToDonut ? "DONUT" : "STEEM" }}
          </span>
        </div>
      </div>
    </div>

    <div class="confirm-box">
      <b-button
        variant="primary"
        class="confirm-btn"
        v-if="isLogin"
        @click="trans"
        :disabled="!canTransFlag"
      >
        <b-spinner small type="grow" v-show="isLoading"></b-spinner>
        {{ $t("message.confirmconvert") }}
      </b-button>
      <b-button
        variant="primary"
        class="connectSteem"
        v-else
        @click="showSteemLogin = true"
      >
        {{ $t("wallet.connectSteem") }}
      </b-button>
    </div>

    <Login v-if="showSteemLogin" @hideMask="showSteemLogin = false" />
    <TipMessage
      :showMessage="tipMessage"
      :title="tipTitle"
      v-if="showMessage"
      @hideMask="showMessage = false"
    />
  </div>
</template>

<script>
import TipMessage from "./ToolsComponents/TipMessage";
import Login from "./Login";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import {
  STEEM_TO_TSP_FEE,
  STEEM_TO_TSP_FEE_RATIO,
  STEEM_TSP_ACCOUNT,
  TRON_CONTRACT_CALL_PARAMS,
} from "../config";
import {
  isAddress,
  amountToInt,
  isTransactionSuccess,
  isInsufficientEnerge,
} from "../utils/chain/tron";
import { getContract } from "../utils/chain/contract";
import { steemTransferVest } from "../utils/chain/steem";
import { formatBalance } from "../utils/helper";

export default {
  name: "Donut",
  components: {
    TipMessage,
    Login,
  },
  data() {
    return {
      canTransFlag: false,
      isLoading: false,
      transValue: "",
      tipMessage: "",
      tipTitle: "",
      showMessage: false,
      showSteemLogin: false,
      fromSteemToDonut: true,
    };
  },
  computed: {
    ...mapState(["steemBalance", "steemAccount", "tronAddress"]),
    ...mapGetters(["tspBalance"]),
    fromTokenBalance() {
      if (this.fromSteemToDonut) {
        return formatBalance(this.steemBalance) + " STEEM";
      } else {
        return formatBalance(this.tspBalance) + " DONUT";
      }
    },
    toTokenBalance() {
      if (!this.fromSteemToDonut) {
        return formatBalance(this.steemBalance) + " STEEM";
      } else {
        return formatBalance(this.tspBalance) + " DONUT";
      }
    },
    isLogin() {
      return this.steemAccount && this.steemAccount.length > 0;
    },
  },

  methods: {
    ...mapActions(["getSteem"]),
    ...mapMutations(["saveSteemBalance"]),

    checkTransValue() {
      this.isLoading = false;
      const reg = /^\d+(\.\d+)?$/;
      const res = reg.test(this.transValue);
      let res1 = false;
      if (parseFloat(this.transValue) > 0) {
        res1 = true;
      }
      if (this.fromSteemToDonut) {

        this.canTransFlag = res1 && res;
      } else {
        const res3 = parseFloat(this.transValue) <= parseFloat(this.tspBalance);
        this.canTransFlag = res1 && res && res3;
      }
    },

    fillMaxTrans() {
      if (this.fromSteemToDonut) {
        this.transValue = this.steemBalance;
        this.transValue = parseFloat(this.steemBalance);
      } else {
        this.transValue = parseFloat(this.tspBalance);
      }
      this.checkTransValue();
    },

    trans() {
      this.isLoading = true;
      this.canTransFlag = false;
      if (this.fromSteemToDonut) {
        this.steemToDonut();
      } else {
        this.donutToSteem();
      }
    },
    
    changeTransOrder() {
      this.fromSteemToDonut = !this.fromSteemToDonut;
      this.transValue = "";
      this.checkTransValue();
    },

    async steemToDonut() {
      try {
        const amount = parseFloat(this.transValue).toFixed(3);
        const res = await steemTransferVest(
          this.steemAccount,
          STEEM_TSP_ACCOUNT,
          amount,
          this.tronAddress
        );
        if (res.success === true) {
          const tspBalance = parseFloat(this.tspBalance);
          const steemBalance = parseFloat(this.steemBalance);
          this.saveTspBalanceInt(amountToInt(tspBalance + parseFloat(amount)));
          this.saveSteemBalance(
            steemBalance - parseFloat(amount)
          );
        } else {
          this.tipTitle = this.$t("error.error");
          this.tipMessage = res.message;
          this.showMessage = true;
        }
      } catch (e) {
        this.tipTitle = this.$t("error.error");
        this.tipMessage = e.message;
        this.showMessage = true;
      } finally {
        this.transValue = "";
        this.checkTransValue();
      }
    },

    async donutToSteem() {
      
    },
  },
  mounted() {
    if (this.steemAccount && this.steemAccount.length > 0) {
      this.getSteem();
      this.getTsp();
      this.getPnut();
    }
  },
};
</script>

<style lang="less" scoped>
@import "../static/css/swap.less";
</style>
