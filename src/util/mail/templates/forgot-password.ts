import Footer from './common/footer';
import Header from './common/header';
import Styles from './common/styles';

const ForgotPassword = ({
  userName,
  passwordResetLink,
}: {
  userName: string;
  passwordResetLink: string;
}) => {
  return `
        ${Styles()}
        ${Header({ title: 'Reset your password' })}
        <div style="font-size: 13px; padding: 10px">
        <p>Hello ${userName},</p>
        <p>
          We have sent you this email in response to your request to reset your
          password.
        </p>
        <p>To reset the password, please follow the link below</p>
        <a href="${passwordResetLink}"
          ><button
            style="
              background-color: #11710d;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
            "
          >
            Reset password
          </button></a
        >
        <p>Please ignore this email if you have not requested.</p>
      </div>
        ${Footer()}
    `;
};

export default ForgotPassword;
