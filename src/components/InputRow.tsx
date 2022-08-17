interface Props {
  icon?: string
  label: string
  children: React.ReactElement
}

const InputRow: React.FC<Props> = ({ icon, label, children }) => (
  <label uno-w="full" uno-flex="~ gap-2" uno-justify="end" uno-items="center">
    {icon && <div className={icon} uno-text="gray-500" />}
    <span uno-text="lg #333">{label}</span>
    {children}
  </label>
)

export default InputRow
