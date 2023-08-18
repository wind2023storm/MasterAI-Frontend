import COLORS from "../../utils/colors";

const styles = {
  layoutStyle: {
    height: "100vh",
  },
  headerStyle: {
    textAlign: "center",
    color: "#fff",
    height: 64,
    paddingInline: 50,
    lineHeight: "normal",
    backgroundColor: "white",
  },
  contentStyle: {
    backgroundColor: COLORS.dark2,
  },
  siderStyle: {
    backgroundColor: "white",
    borderLeft: `1px solid ${COLORS.grey1}`,
  },
  footerStyle: {
    textAlign: "center",
    // height: 50,
    color: "#fff",
    backgroundColor: COLORS.dark2,
  },
  headerContentStyle: {
    float: "left",
    margin: "7px 0",
  },
  iconStyle: {
    fontSize: 22,
    color: "rgba(128, 128, 128, 0.88)",
  },
  titleStyle: {
    margin: 0,
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  uploadListStyle: {},
};

export default styles;
