import styles from './Button.module.css';
interface IProps {
  children: any;
  variant: 'primary' | 'secondary' | 'optional' | 'text';
  onClick: any;
  className?: string;
}
/**
 * A wrapper for flexbox columns, which can be used to render a passed children as a flexbox column.
 * Basic styling can be passed as props, otherwise default values are used.
 * If more styling is needed, a classname can and should be passed.
 */

const Button = ({ children, variant, onClick, className }: IProps) => {
  const classes = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    optional: styles.optionalButton,
    text: styles.textButton
  };
  return (
    <button className={`${classes[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
export default Button;
