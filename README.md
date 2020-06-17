# flat-step-flow
扁平化步骤流程控制

## Table of Contents

<!-- MarkdownTOC autolink=true bracket=round depth=2 -->

- [Install](#install)
- [Example](#example)

<!-- /MarkdownTOC -->

## Install

```bash
$ npm install --save flat-step-flow
```

## Example
```javascript
import FlatStepFlow from 'flat-step-flow';
const flatStepFlow = new FlatStepFlow();

/**
 * 添加步骤以及对应的函数。
 * 如果指定的步骤已经存在，这些函数将会追加到这个步骤中。
 * 如果不存在，则新建一个新的步骤。
 *
 * 这里添加的每一个函数在执行时都会接收到参数`(context, next, nextTo, data)`：
 *
 * 只有调用`next()`，才会继续执行步骤中的下一个函数。如果调用时，传入了非空的参数`err`，则后面的函数不再执行，使用`catch(fn)`设置的错误处理函数会被执行。
 * 如果调用`next()`/`nextTo()`时，传递了参数`data`，**下一个**函数会接收到这个数据。
 * 但是，下一个之后的的函数不会接收到这个数据，除非在下一个函数中再次调用`next()/nextTo()`时传递`data`。
 *
 * @param stepName 需要新建或者追加函数的步骤名称，如果省略这个参数，默认使用`default`
 */
flatStepFlow.use('stepName', ()=>{});

/**
 * 执行当前步骤的下一个方法。
 * 如果当前步骤的方法都已经执行完毕，并且还有下一个步骤，会自动执行下一个步骤的方法。
 *
 * @param thisArg
 * @param indexInfo 当前执行的位置信息
 * @param context 上下文对象，每个步骤的函数都会接受到这个参数
 * @param err 错误信息，如果调用`next()`的时候，第一个参数非空，则会执行错误处理函数。
 * @param data 需要传递到下一个函数的数据
 */
flatStepFlow.next(this, indexInfo, context, err, data);

/**
 * 跳转到指定的步骤，然后执行该步骤的方法。
 * 跳转的目标步骤，可以是任何一个存在的步骤，这个步骤可以在当前步骤之前，也可以在当前步骤之后，
 * 甚至就是当前步骤。
 *
 * @param thisArg
 * @param context 上下文对象，每个步骤的函数都会接受到这个参数
 * @param step 步骤名称
 * @param [data] 需要传递到下一个函数的数据
 */
flatStepFlow.nextTo(this, context, step, data);

/**
 * 添加错误处理函数，当调用`next(err)`，并传递非空的`err`参数时，会调用这些错误处理函数。
 *
 * 参数`fn`会接受到参数`(err)`, `err`为错误信息。
 *
 * @param fn 错误处理函数
 *
 */
flatStepFlow.catch((err)=>{});

/**
 * 开始执行步骤函数。
 * 如果指定了步骤名称，将从对应的步骤开始执行。如果没有指定，则从第一个步骤开始执行。
 *
 * @param context 上下文对象，每个步骤的函数都会接受到这个参数
 * @param stepName 起始步骤名称，默认从第一个步骤开始
 * @param thisArg 指定步骤函数的this
 */
flatStepFlow.run(context, stepName, this);
```
