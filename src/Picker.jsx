import '../style';
import React from 'react';
import PopupCascader from 'rmc-cascader/lib/Popup';
import Cascader from 'rmc-cascader/lib/Cascader';
import MultiPicker from 'rmc-picker/lib/MultiPicker.web';
import treeFilter from 'array-tree-filter';
import popupProps from './popupProps';

function getDefaultProps() {
  const defaultFormat = (values) => {
    return values.join(',');
  };
  return {
    triggerType: 'onClick',
    prefixCls: 'am-picker',
    pickerPrefixCls: 'am-picker-col',
    popupPrefixCls: 'am-picker-popup',
    format: defaultFormat,
    cols: 3,
    cascade: true,
    value: [],
    extra: '请选择',
    okText: '确定',
    dismissText: '取消',
    title: '',
    styles:{}
  };
}

class Picker extends React.Component{

  getSel = () => {
    const value = this.props.value || [];
    let treeChildren;
    if (this.props.cascade) {
      treeChildren = treeFilter(this.props.data, (c, level) => {
        return c.value === value[level];
      });
    } else {
      treeChildren = value.map((v, i) => {
        return this.props.data[i].filter(d => d.value === v)[0];
      });
    }
    return this.props.format && this.props.format(treeChildren.map((v) => {
        return v.label;
      }));
  }

  render() {
    const { props } = this;
    const { children, value, extra, okText, dismissText, popupPrefixCls, cascade } = props;
    let cascader;
    let popupMoreProps = {};
    if (cascade) {
      cascader = (
        <Cascader
          prefixCls={props.prefixCls}
          pickerPrefixCls={props.pickerPrefixCls}
          data={props.data}
          cols={props.cols}
          onChange={props.onPickerChange}
        />
      );
    } else {
      cascader = (
        <MultiPicker
          prefixCls={props.prefixCls}
          pickerPrefixCls={props.pickerPrefixCls}
        >
          { props.data.map(d => { return { props: { children: d } }; }) }
        </MultiPicker>
      );
      popupMoreProps = {
        pickerValueProp: 'selectedValue',
        pickerValueChangeProp: 'onValueChange',
      };
    }
    return (
      <PopupCascader
        cascader={cascader}
        {...popupProps}
        {...props}
        prefixCls={popupPrefixCls}
        value={value}
        dismissText={dismissText}
        okText={okText}
        {...popupMoreProps}
      >
        {React.cloneElement(children, { extra: this.getSel() || extra })}
      </PopupCascader>
    );
  }
}
Picker.defaultProps = getDefaultProps();
Picker.propTypes = {
  data: React.PropTypes.any,
  cascade:React.PropTypes.bool,
  value:React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.number),
      React.PropTypes.arrayOf(React.PropTypes.string),
  ]),
  format:React.PropTypes.func,
  cols: React.PropTypes.number,
  extra: React.PropTypes.string,
  children: React.PropTypes.any,
  onChange:React.PropTypes.func,
  /** web only */
  pickerPrefixCls: React.PropTypes.string,
  popupPrefixCls: React.PropTypes.string,
  onPickerChange:React.PropTypes.func
};
Picker.displayName = "Picker";
module.exports=Picker;
