import { Button, Col, Row, Typography, Layout, Space } from "antd";
import { CodeOutlined, CloudOutlined, RocketOutlined } from "@ant-design/icons";
import { useCreateProject } from "../hooks/apis/mutations/useCreateProject";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export const CreateProject = () => {
  const { createProjectMutation } = useCreateProject();
  const navigate = useNavigate();

  async function handleCreateProject() {
    console.log("Going to trigger the api");
    try {
      const response = await createProjectMutation();
      console.log("Now we should redirect to the editor");
      navigate(`/project/${response.data}`);
    } catch (error) {
      console.log("Error creating project", error);
    }
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#fff", padding: "0 24px" }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0 }}>
              <CloudOutlined /> Cloud Code Studio
            </Title>
          </Col>
          <Col>
            <Space>
              <Button>Login</Button>
              <Button>Sign Up</Button>
            </Space>
          </Col>
        </Row>
      </Header>

      <Content style={{ padding: "50px 24px" }}>
        <Row gutter={[32, 32]} justify="center">
          <Col xs={24} md={16} style={{ textAlign: "center" }}>
            <Title>Code Anywhere, Anytime</Title>
            <Paragraph style={{ fontSize: "18px", color: "#666" }}>
              Build, test, and deploy your applications with our powerful cloud-based
              development environment. Start coding instantly with zero setup.
            </Paragraph>
            
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={handleCreateProject}
              style={{ marginTop: "20px" }}
            >
              Create Project
            </Button>
          </Col>
        </Row>

        <Row gutter={[24, 24]} style={{ marginTop: "60px" }}>
          <Col xs={24} sm={8}>
            <Space direction="vertical" align="center" style={{ width: "100%" }}>
              <CodeOutlined style={{ fontSize: "40px", color: "#1890ff" }} />
              <Title level={4}>Instant Setup</Title>
              <Paragraph style={{ textAlign: "center" }}>
                Pre-configured environments ready to code in seconds
              </Paragraph>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
            <Space direction="vertical" align="center" style={{ width: "100%" }}>
              <CloudOutlined style={{ fontSize: "40px", color: "#1890ff" }} />
              <Title level={4}>Cloud-Based</Title>
              <Paragraph style={{ textAlign: "center" }}>
                Access your projects from any device, anywhere
              </Paragraph>
            </Space>
          </Col>
          <Col xs={24} sm={8}>
            <Space direction="vertical" align="center" style={{ width: "100%" }}>
              <RocketOutlined style={{ fontSize: "40px", color: "#1890ff" }} />
              <Title level={4}>Fast Deployment</Title>
              <Paragraph style={{ textAlign: "center" }}>
                Deploy your applications with a single click
              </Paragraph>
            </Space>
          </Col>
        </Row>
      </Content>

      <Footer style={{ textAlign: "center" }}>
        Cloud Code Studio ©2025 Created by Mahesh
      </Footer>
    </Layout>
  );
};