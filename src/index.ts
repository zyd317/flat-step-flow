/**
 * @file 步骤流程控制
 */
export default function FlatStepFlow(this: {
    errorHandles: (() => void)[];
    steps: (string)[];
    flows: ((
        context: any,
        next: (err: Error | string, data?: any) => void,
        nextTo: (thisArg: any, context: any, step: string, data: any) => void,
        data: any
    ) => void)[];
}) {
    // 存储所有步骤和对应的函数
    this.flows = [];
    // 存储所有的步骤名称，保证执行顺序
    this.steps = [];
    // 存储错误处理函数
    this.errorHandles = [];
}

FlatStepFlow.prototype = {
    constructor: FlatStepFlow,

    use(stepName: string = 'default', /*, fn1, fn2, fn3, ... */): typeof FlatStepFlow.prototype {
        const stepNamesFunction = typeof stepName === 'function';
        const step = stepNamesFunction ? 'default' : String(stepName);
        const fns = [].slice.call(arguments, stepNamesFunction ? 0 : 1);
        let flow = this.flows[step];
        const steps = this.steps;

        if (steps.indexOf(step) === -1) {
            steps.push(step);
        }

        if (!Array.isArray(flow)) {
            flow = this.flows[step] = [];
        }

        fns.forEach(function func(fn: () => void) {
            typeof fn === 'function' && flow.push(fn);
        });

        return this;
    },

    run(context: any, stepName?: string, thisArg?: any): typeof FlatStepFlow.prototype {
        const steps = this.steps;
        let stepIndex = stepName ? steps.indexOf(stepName) : 0;
        let indexInfo = {} as IFlatStepFlow.IIndexInfo;

        if (stepIndex === -1) {
            stepIndex = 0;
        }

        indexInfo = {stepIndex, flowIndex: 0};

        this.next(thisArg, indexInfo, context || {}, null);

        return this;
    },

    next(thisArg: any, indexInfo: IFlatStepFlow.IIndexInfo, context: any, err: Error | string | null, data?: any): typeof FlatStepFlow.prototype {
        if (err) {
            this._runErrorHandlers(err, context, thisArg);
            return this;
        }

        const steps = this.steps;
        const flows = this.flows;
        let step = steps[indexInfo.stepIndex];
        let flow = flows[step];

        if (indexInfo.flowIndex >= flow.length) {
            // 当前步骤中的函数已经执行完毕
            if (indexInfo.stepIndex < steps.length - 1) {
                // 还有待执行的步骤
                indexInfo.stepIndex += 1;
                indexInfo.flowIndex = 0;
                step = steps[indexInfo.stepIndex];
                flow = flows[steps[indexInfo.stepIndex]];
            } else {
                // 所有的函数已经执行完毕
                return this;
            }
        }

        const curr = flow[indexInfo.flowIndex++];
        const nextFn = this.next.bind(this, thisArg, indexInfo, context);
        const nextToFn = this.nextTo.bind(this, thisArg, context);

        try {
            curr.call(thisArg, context, nextFn, nextToFn, data);
        } catch (err) {
            this._runErrorHandlers(err, context, thisArg);
        }

        return this;
    },
    nextTo(thisArg: any, context: any, step: string, data: any): typeof FlatStepFlow.prototype {
        const steps = this.steps;
        const stepIndex = steps.indexOf(step);

        if (typeof step !== 'string' || !step) {
            throw Error('The `step` parameter must be a non-empty string');
        }

        if (stepIndex === -1) {
            throw Error('The step `' + step + '` not exists');
        }

        this.next(thisArg, {stepIndex, flowIndex: 0}, context, null, data);

        return this;
    },

    catch(fn: () => void): typeof FlatStepFlow.prototype {
        this.errorHandles.push(fn);
        return this;
    },

    _runErrorHandlers(err: Error | string, ctx: any, thisArg: any): typeof FlatStepFlow.prototype {
        this.errorHandles.forEach(function errorHandle(fn: () => void) {
            fn.call(thisArg, err, ctx);
        });

        return this;
    },
};