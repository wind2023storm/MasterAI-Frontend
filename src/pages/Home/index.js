import { Button, Input, Layout, Upload, Menu, Tooltip, Spin } from "antd";
import { useState, useEffect, useRef } from "react";
import { DeleteOutlined, DownloadOutlined, FileTextOutlined } from "@ant-design/icons";
import axios from "axios";

const API_HOST = process.env.REACT_APP_BASE_URL;

const { Content, Sider } = Layout;

function App() {
  const [messages, setMessages] = useState([]);
  const [sentMsg, setSentMsg] = useState("");
  // const [chatBotID, setChatBotID] = useState("");
  // const [chatBotName, setChatBotName] = useState("");
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [createBotLoading, setCreateBotLoading] = useState(false);
  const [gettingReply, setGettingReply] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [items, setItems] = useState([]);

  const chatRef = useRef(null);

  useEffect(() => {
    //showModal();
  }, []);

  useEffect(() => {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
    console.log("Updated Messages:", messages);
  }, [messages]);

  const handleSendMessage = () => {
    if (sentMsg.trim()) {
      let data = messages;
      data.push({ text: sentMsg, type: 0 });
      console.log("Before:", data);
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
      let formData = new FormData();
      //formData.append("namespace", chatBotID);
      formData.append("message", sentMsg);
      formData.append("history", JSON.stringify(data));
      setGettingReply(true);
      axios
        .post(`${API_HOST}/getReply`, formData)
        .then((res) => {
          console.log("=====", res.data);
          data.push({ text: res.data, type: 1 });
          console.log("After:", data);
          setMessages([...data]);
          setGettingReply(false);
        })
        .catch(() => {
          setGettingReply(false);
        });
      setSentMsg("");
    }
  };

  const handleInputChange = (e) => {
    setSentMsg(e.target.value);
  };

  const beforeUpload = (file) => {
    let formData = new FormData();
    console.log("beforeUpload:::::   ", file);
    formData.append("file", file);
    //formData.append("namespace", chatBotID);
    setUploadingDoc(true);
    axios
      .post(`${API_HOST}/sendfile`, formData)
      .then((res) => {
        addItem({ data: res.data.data });
        setUploadingDoc(false);
        console.log(res.data.message);
      })
      .catch((e) => {
        console.log(e);
        alert("Sorry, but There seem be a little problems on server side.");
      });
  };

  const addItem = (item) => {
    setItems([...items, { item, icon: <FileTextOutlined /> }]);
  };

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleOk = () => {
  //   if (chatBotID != "") {
  //     setCreateBotLoading(true);
  //     let formData = new FormData();
  //     formData.append("namespace", chatBotID);
  //     axios
  //       .post(`${API_HOST}/regChatBot`, formData)
  //       .then((res) => {
  //         setChatBotName(res.data.message);
  //         setCreateBotLoading(false);
  //         setIsModalOpen(false);
  //       })
  //       .catch(() => {
  //         alert("Sorry, but There seem be a little problems on server side.");
  //         // console.log(err)
  //       });
  //   }
  // };

  const handleDelChat = () => {
    setMessages([]);
  };

  const handleExportChat = () => {
    if (messages.length) {
      let exportData = "";
      messages.map((message) => {
        exportData += (!message.type ? "You" : "chatBot") + ":  " + message.text + "\n";
      });
      const element = document.createElement("a");
      const file = new Blob([exportData], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      let now = new Date();
      element.download =
        "Chat_With_" +
        "chatBot" +
        "_" +
        now.getFullYear() +
        "_" +
        (now.getMonth() + 1) +
        "_" +
        now.getDate() +
        "_" +
        now.getHours() +
        "_" +
        now.getMinutes() +
        "_" +
        now.getSeconds() +
        "_" +
        now.getMilliseconds() +
        ".txt";
      document.body.appendChild(element);
      element.click();
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider theme="light" width={200} style={{ backgroundColor: "rgb(0, 21, 41)", padding: 8 }}>
        <h1 style={{ color: "white" }}>Chat App</h1>
        <p style={{ color: "white" }}>Welcome to the chat app!</p>

        <Spin spinning={uploadingDoc}>
          <Upload.Dragger className="custom-uploader" beforeUpload={beforeUpload}>
            <p className="ant-upload-drag-icon">
              <span>+ Add Document</span>
            </p>
            <p className="ant-upload-text">
              <span>Drop Document here</span>
            </p>
            <p className="ant-upload-hint">{/* add your custom hint text */}</p>
          </Upload.Dragger>
        </Spin>
        <Menu
          defaultSelectedKeys={[]}
          mode="inline"
          theme="dark"
          items={items}
          selectable={false}
        />
      </Sider>
      <Layout>
        <h1 style={{ paddingLeft: "20px" }}>Chatbot</h1>
        <Content
          style={{
            overflow: "auto",
            flex: 1,
            margin: "auto",
            width: "100%",
            padding: "40px 10% 20px 10%",
          }}
          ref={chatRef}
        >
          <div style={{ position: "absolute", right: "20px", top: "20px" }}>
            <Tooltip title="Export Chat">
              <Button type="dashed" size={"small"} onClick={handleExportChat}>
                <DownloadOutlined />
              </Button>
            </Tooltip>
            <Tooltip title="Delete Chat">
              <Button type="dashed" size={"small"} onClick={handleDelChat}>
                <DeleteOutlined />
              </Button>
            </Tooltip>
          </div>
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                marginBottom: 8,
                display: "flex",
                justifyContent: `${message.type == 1 ? "flex-start" : "flex-end"}`,
              }}
            >
              <div
                style={{
                  backgroundColor: `${message.type == 1 ? "#ffffff" : "#1777ff"}`,
                  borderRadius: "8px",
                  color: `${message.type == 1 ? "#000" : "white"}`,
                  padding: "8px",
                  maxWidth: "calc(100% - 400px)",
                }}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div
            style={{
              marginBottom: 8,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                backgroundColor: "#f9f9fe",
                borderRadius: "8px",
                color: "#222",
                padding: "8px",
              }}
            >
              <Spin spinning={gettingReply}></Spin>
            </div>
          </div>
        </Content>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "auto",
            marginBottom: "16px",
            maxWidth: "768px",
            width: "80%",
          }}
        >
          <Input
            value={sentMsg}
            onChange={handleInputChange}
            onPressEnter={handleSendMessage}
            // disabled={!items.length || gettingReply}
            placeholder={`${
              items.length > 0
                ? "Ask any question about all documents you uploaded..."
                : "Upload the documents to train..."
            }`}
          />
          <Button
            type="primary"
            onClick={handleSendMessage}
            loading={gettingReply}
            disabled={!items.length}
            style={{ marginLeft: 8, backgroundColor: "#4E6EF5", borderColor: "#4E6EF5" }}
          >
            Send
          </Button>
        </div>
      </Layout>
      {/* <Modal
        title="Enter your ChatBot name."
        cancelButtonProps={{ style: { display: "none" } }}
        open={isModalOpen}
        okButtonProps={{ style: { display: "none" } }}
        footer={
          <Button type="primary" loading={createBotLoading} onClick={handleOk}>
            OK
          </Button>
        }
        closable={false}
      >
        <Input
          placeholder="Enter your ChatBot name."
          onChange={(e) => setChatBotID(e.target.value)}
        />
      </Modal> */}
    </Layout>
  );
}

export default App;
