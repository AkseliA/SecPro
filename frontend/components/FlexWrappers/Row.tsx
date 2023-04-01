interface IProps {
  children: any;
  justifyContent?:
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'stretch';
  alignContent?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  width?: string;
  margin?: string;
  padding?: string;
  gap?: string;
  className?: string;
}
/**
 * A wrapper for flexbox rows, which can be used to render a passed children as a flexbox row.
 * Basic styling can be passed as props, otherwise default values are used.
 * If more styling is needed, a classname can and should be passed.
 */
const Row = ({
  children,
  justifyContent,
  alignContent,
  width,
  margin,
  padding,
  gap,
  className
}: IProps) => {
  return (
    <div
      className={className}
      style={
        className
          ? {
              display: 'flex',
              flexDirection: 'row'
            }
          : {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: justifyContent || 'initial',
              alignItems: alignContent || 'initial',
              width: width || 'auto',
              margin: margin || 'initial',
              padding: padding || 'initial',
              gap: gap || 'initial'
            }
      }
    >
      {children}
    </div>
  );
};

export default Row;
