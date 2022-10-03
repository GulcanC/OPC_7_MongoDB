<script>
import axios from "axios";

export default {
  created() {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    if (token) {
      axios.post("auth/verify", {}, config).then((res) => {
        console.log(res.data);
        this.$store.commit("setUser", res.data);
        this.$router.push("/post");
      });
    } else if (!token) {
      this.$router.push("/");
    }
  },
};
</script>
